from os import path
from docker import client
import io, tarfile, docker
import docker.errors
import docker.models
import docker.models.containers
import time
import threading
import socket

from services.utils.config import EXECUTORS

class Result:
    def __init__(self):
        self.exit_code = 0
        self.status = ""
        self.output = ""

def strip_docker_headers(raw: bytes) -> bytes:
    output = b""
    while len(raw) >= 8:
        # First byte = stream type (1=stdout, 2=stderr), next 3 = padding, next 4 = size
        size = int.from_bytes(raw[4:8], byteorder='big')
        output += raw[8:8 + size]
        raw = raw[8 + size:]
    return output

def start_container(language: str) -> docker.models.containers.Container:
    
    client = docker.from_env()
    config = EXECUTORS.get(language)

    image, build_path = config['image'], config['build_path']

    try:
        img = client.images.get(image)
    except:
        img = client.images.build(path=build_path, tag=image)

    cont = client.containers.run(image, command="sleep 1000", detach=True, pids_limit=16, mem_limit="200m", read_only=True, tmpfs={
        "/home/sandbox/workdir/" : 'size=16m,uid=1000,gid=1000,exec'
    }, network_disabled=True, cap_drop=["ALL"], security_opt=["no-new-privileges:true"])

    return cont

def process_code(code, language, input, expected):

    final_result = Result()
    language = language.lower()

    cont = start_container(language)
    config = EXECUTORS.get(language)

    try: 

        res = cont.exec_run(f"sh -c 'cat > /home/sandbox/workdir/{config['filename']}'", socket=True, stdin=True)
        
        res.output._sock.sendall(code.encode())
        res.output._sock.close()

        compilation_result = cont.exec_run(cmd=[config['compiler'], config['filename'], "-o", "main"], workdir="/home/sandbox/workdir")

        if compilation_result.exit_code == 0:
            run_code(input, expected, cont, final_result)
        else:
            final_result.status = "FAILURE"
            final_result.exit_code = compilation_result.exit_code
            final_result.output = compilation_result.output.strip().decode()

    except docker.errors.DockerException:
        final_result.exit_code = 1
        final_result.status = "FAILURE"
        final_result.output = "TRY RUNNING AGAIN"

    finally:
        cont.remove(force=True)
        
    return final_result.exit_code, final_result.status, final_result.output

    

def worker(input, container, worker_result):

    # res = container.exec_run("sh -c 'cat > /home/sandbox/workdir/input.txt'", socket=True, stdin=True)
    # res.output._sock.sendall(input.encode())
    # res.output._sock.close()

    client = docker.from_env()

    exec_instance = client.api.exec_create(
        container=container.id, 
        cmd="sh -c 'cat > /home/sandbox/workdir/input.txt'",
        stdin=True,
        stdout=True,
        stderr=True)
    
    exec_id = exec_instance["Id"]

    sock = client.api.exec_start(exec_id=exec_id, socket=True)

    sock._sock.sendall(input.encode())
    sock._sock.shutdown(socket.SHUT_WR)

    while True:
        info = client.api.exec_inspect(exec_id=exec_id)
        if not info["Running"]:
            break

        time.sleep(0.01)

    try:
        exit_code, (stdout, stderr) = container.exec_run("sh -c './main < input.txt'", workdir="/home/sandbox/workdir", demux=True)
    except Exception:
        return
    
    worker_result.exit_code = exit_code
    if exit_code != 0:
        worker_result.status = "FAILURE"
        if stderr is not None:
            worker_result.output = stderr.decode().rstrip()
    else:
        worker_result.status = "SUCCESS"
        worker_result.output = stdout.decode().rstrip()

            

def run_code(input, expected, container, final_result):

    worker_result = Result()

    t = threading.Thread(target=worker, args=[input, container, worker_result])
    t.start()
    t.join(timeout=5)

    container.reload()

    if container.attrs["State"]["OOMKilled"]:
        final_result.status = "FAILURE"
        final_result.output = "MEMORY LIMIT EXCEEDED"
        final_result.exit_code = 1
    elif t.is_alive():
        final_result.status = "TLE"
        final_result.output = "TIME LIMIT EXCEEDED"
        final_result.exit_code = 1
    elif worker_result.output != expected.rstrip():
        final_result.status = "FAILURE"
        final_result.exit_code = 1
        final_result.output = worker_result.output
    else:
        final_result.output = worker_result.output
        final_result.status = "SUCCESS"
        final_result.exit_code = 0
    