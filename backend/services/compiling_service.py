import io, tarfile, docker
import docker.errors
import docker.models
import docker.models.containers
import time
import threading

output = None
exit_code = 0
status = "DEFAULT"

def strip_docker_headers(raw: bytes) -> bytes:
    output = b""
    while len(raw) >= 8:
        # First byte = stream type (1=stdout, 2=stderr), next 3 = padding, next 4 = size
        size = int.from_bytes(raw[4:8], byteorder='big')
        output += raw[8:8 + size]
        raw = raw[8 + size:]
    return output

def start_container() -> docker.models.containers.Container:
    client = docker.from_env()

    try:
        cont = client.containers.run("code_runner_image", command="sleep 1000", detach=True, pids_limit=16, mem_limit="200m", read_only=True, tmpfs={
            "/home/sandbox/workdir/" : 'size=16m,uid=1000,gid=1000,exec'
        })

    except docker.errors.ImageNotFound:
        client.images.build(path="./", tag="code_runner_image")
        cont = client.containers.run("code_runner_image", command="sleep 1000", detach=True, pids_limit=16, mem_limit="200m", read_only=True, tmpfs={
            "/home/sandbox/workdir/" : 'size=16m,uid=1000,gid=1000,exec'
        })

    return cont

def process_code(code, input, expected):
    cont = start_container()

    res = cont.exec_run("sh -c 'cat > /home/sandbox/workdir/main.c'", socket=True, stdin=True)
    res.output._sock.sendall(code.encode())
    res.output._sock.close()

    compilation_result = cont.exec_run(cmd=["gcc", "main.c", "-o", "main"], workdir="/home/sandbox/workdir")

    if compilation_result.exit_code == 0:
        exit_code, status, output = run_code(input, expected, cont)
        cont.remove(force=True)
        return exit_code, status, output
    else:
        status = "FAILURE"
        cont.remove(force=True)
        return compilation_result.exit_code, status, compilation_result.output.strip().decode()
    

    

def worker(input, expected, container):

    global output, exit_code, status

    res = container.exec_run("sh -c 'cat > /home/sandbox/workdir/input.txt'", socket=True, stdin=True)
    res.output._sock.sendall(input.encode())
    res.output._sock.close()

    exit_code, (output, stderr) = container.exec_run("sh -c './main < input.txt'", workdir="/home/sandbox/workdir", demux=True)
    if output:
        output = output.decode().rstrip()
    else:
        output = ""

    container.reload()

    if container.attrs["State"]["OOMKilled"]:
        status = "FAILURE"
        output = "MEMORY LIMIT EXCEEDED"
        exit_code = 1
            
    elif output != expected:
        status = "FAILURE"
        exit_code = 1
    else:
        status = "SUCCESS"
        exit_code = 0

def run_code(input, expected, container):

    global output, exit_code, status

    t = threading.Thread(target=worker, args=[input, expected, container])
    t.start()
    t.join(timeout=5)

    if t.is_alive():
        status = "TLE"
        output = "TIME LIMIT EXCEEDED"
        exit_code = 1
    
    return exit_code, status, output
