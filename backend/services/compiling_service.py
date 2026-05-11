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
        cont = client.containers.run("code_runner_image", command="sleep 1000", detach=True)
    except docker.errors.ImageNotFound:
        client.images.build(path="./", tag="code_runner_image")
        cont = client.containers.run("code_runner_image", command="sleep 1000", detach=True)

    return cont

def process_code(code, input, expected):
    data = io.BytesIO()

# 1. tar.add() file only works with the actual file system paths it the input is a string we have to create the tar manually
# 2. tarfile() create the header with the given arguments
# 3. tar format needs file size in the header before writing contents to it.

    with tarfile.open(fileobj=data, mode='w') as tar:
        content = code.encode()
        info = tarfile.TarInfo("main.c")
        info.size = len(content)
        tar.addfile(info, io.BytesIO(content))
    
    data.seek(0)
    cont = start_container()
    cont.put_archive("/tmp", data.read())

    compilation_result = cont.exec_run(cmd=["gcc", "main.c", "-o", "main"], workdir="/tmp")

    if compilation_result.exit_code == 0:
        exit_code, status, output = run_code(input, expected, cont)
        return exit_code, status, output
    else:
        status = "FAILURE"
        cont.remove(force=True)
        return compilation_result.exit_code, status, compilation_result.output.strip().decode()
    

def worker(input, expected, container):

    global output, exit_code, status

    sock = container.exec_run(cmd=["./main"], workdir="/tmp", stdin=True, socket=True)

    sock.output._sock.sendall((input+"\n").encode())

    output = b""
    while True:
        try:
            Chunk = sock.output._sock.recv(4096)
        except Exception:
            sock.output._sock.close()
            return

        if not Chunk:
            break
        output += Chunk

    output = strip_docker_headers(output).decode().rstrip()

    if output != expected:
        status = "FAILURE"
        exit_code = 1
    else:
        status = "SUCCESS"
        exit_code = 0

    sock.output._sock.close()

def run_code(input, expected, container):

    global output, exit_code, status

    t = threading.Thread(target=worker, args=[input, expected, container])
    t.start()
    t.join(timeout=5)

    if t.is_alive():
        container.remove(force=True)
        status = "TLE"
        output = "TIME LIMIT EXCEEDED"
        exit_code = 1
    
    return exit_code, status, output


    
    
    



