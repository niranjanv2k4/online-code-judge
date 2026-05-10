import io, tarfile, docker
import docker.errors
import docker.models
import docker.models.containers

def start_container() -> docker.models.containers.Container:
    client = docker.from_env()

    try:
        cont = client.containers.run("code_runner_image", command="sleep 1000", detach=True)
    except docker.errors.ImageNotFound:
        client.images.build(path="./", tag="code_runner_image")
        cont = client.containers.run("code_runner_image", command="sleep 1000", detach=True)

    return cont

def process_code(code):
    data = io.BytesIO()

# 1. tar.add() file only works with the actual file system paths it the input is a string we have to create the tar manually
# 2. tarfile() create the header with the given arguments
# 3. tar format needs file size in the header before writing contents to it.

    with tarfile.open(fileobj=data, mode='w') as tar:
        content = code.encode()  #convert python string into bytes
        info = tarfile.TarInfo("main.c")
        info.size = len(content)
        tar.addfile(info, io.BytesIO(content))
    
    data.seek(0)

    cont = start_container()

    home = cont.exec_run("/bin/sh -c 'echo $HOME'").output.strip().decode()

    cont.put_archive(f"{home}/", data.read())

    print(cont.exec_run(f"ls {home}/").output.strip().decode())

    compilation_result = cont.exec_run(f"gcc {home}/main.c -o {home}/main")
    if(compilation_result.exit_code == 0):
        status = "SUCCESS"
        output = cont.exec_run(f"{home}/main")
    else:
        status = "FAILURE"
        output = compilation_result
    

    cont.kill()

    return output.exit_code, status, output.output.strip().decode()

