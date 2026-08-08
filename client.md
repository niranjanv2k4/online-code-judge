1. What is a client?
	- client is a python object which can be used to interact with the system docker daemon.
	- Using this object we can manage container, images, volumes, network etc.
- **NOTE: Using this command python is not running the docker it is just interacting with the daemon on the system, usually through `var/run/docker.sock`**
- `client.containers.run("ubuntu", "echo hello world")
	- pull the image `ubuntu` if necessary -> create the container -> run `echo hello world` -> exits and returns the logs as bytes 
	- since the output is returned as bytes we have to use `decode()` to get the actual value.
- `client.containers.run("ubuntu", "echo hello world", Detach=True)` 
	- earlier version returns the bytes of logs but this version runs the container in detached mode and return the container object.
- **OTHER METHODS IN  CLIENT**
	- `client.containers.list()`
	- `cont = client.containers.get(<id>)`
	- `cont.attrs[][]`
	- `cont.stop()`
	- `client.images.list()`
	- `client.images.pull()`
- **REFER:[ DETAILED CLIENT DOCUMENTATION](https://docker-py.readthedocs.io/en/stable/client.html)**



# <u>Containers</u>

### -> What are containers?
ans) Containers are just  processes. When we start a container, we are actually starting a linux process. After that container runtime like docker or podman, will use the existing linux feature to provide isolation

| Feature                | Contianer                           | Virtual machines                    |
| ---------------------- | ----------------------------------- | ----------------------------------- |
| **Virtualisation**     | OS - level virtualilzation          | H/W level virtualization            |
| **Kernel**             | Shares the host's kernel            | Has its own guest kernel            |
| **Size**               | Lightweight                         | Heawyweight                         |
| **Start up time**      | Seconds                             | Can be minutes minutes              |
| **Resource usage**     | Low overhead                        | High over head                      |
| **Isolation**          | Process level isolation             | Stronger full machine isolation     |
| **Performance**        | Near native performance             | Slow because of hypervisor          |
| **Operation System**   | Must use same kernel family as host | Must use same kernel family as host |
| **Boot process**       | No full OS boot                     | Full OS boot required               |
| **Disk Usage**         | Smaller images                      | Large VM disk images                |
| **Portability**        | Very portable across environments   | Portable but heavier                |
| **Security Isolation** | Weaker compared to VMs              | Stronger isolation                  |
| **Management**         | Easier to deploy and scale          | More complex management             |
| **Hypervisor**         | Not required                        | Required                            |

### ->What are the different level of isolation provided by the linux?


![[Pasted image 20260510110230.png]]

-> The above picture shows the isolation mechanism used by containers to isolated themselves from the underlying host and from each other.

#### 1. Linux namespaces

-> Namespaces are used to provide an isolated view of resources on a host.
-> Currently there are eight namespaces in linux, they are **`mnt, pid, net, ipc, utc, cgroup, user, time`**
-> first six are enables as default in docker containers.
-> `sudo lsns` for listing namespaces. try running the command before and after running a container. 
-> `sudo nsenter --target <pid> --<namespace> <command>` will run the command on the given namespace
	eg: `sudo nsenter --target 2706 --mount ls /` will list the content in the root directory of the process 2706.
-> we don't really need the docker tooling, we can use `nsenter`

> [!example] Analogy
>Think of namespaces like separate rooms inside the same building.
  > - The building = Linux kernel
  > - Rooms = namespaces
  > - People inside each room = processes
  > 
> People inside one room:
>- cannot see what is happening in another room.
>- may think they are alone
>- still depend on the same building infrastructure
>
> Similarly:
>- containers share the same kernel
>- but operate inside isolated namespaces

-> Why namespaces are needed?
ans) In a normal linux system, all process use the same process table, same network interface, same files system mounts, same host name, share the IPC resources. This creates problems like
		i. One application can see other application's processes
		ii. Two applications cannot use the same port 80
		iii.Application can interfere with each other



| without namespace                      | with namespace                                 |
| -------------------------------------- | ---------------------------------------------- |
| `app A -> port 80`                     | Namespace A:<br>    `App A -> port 80`<br><br> |
| `app B -> port 80`                     | Namespace B:<br>    `App B -> port 80`         |
| error `Address already in use`         | No conflict                                    |
| Because both are in the same namespace | Because both have seperate namespace           |
**But
`docker run -p 8080:80 nginx
`docker run -p 8080:80 apache`

**-> This will case `Address already in use` error, why? because both are trying to use the same port in the same namespace, which is the namespace of the host.**
**-> The containers usually run on separate namespaces, so they will have a separate network stack and so they can use their own port 80, but when they try to bind to the same port of the host machine, then they will try to use the same port on the host namespace, so one of them will get the already in use error.**

##### 1. `mnt`
-> Gives separate file system view.
-> A container can mount/unmount without affecting the host or other containers.
->`Cont A see /app and Cont B sees /app but they could mean entirely differnet directories in host'
-> without `mnt` namespace
	- Processes see the host file system mounts.
	- Mount / unmount operation affect the host.
	- Containers will not have isolated file system views.

##### 2. `net` 
-> Gives each separate network stack.
-> Each container have its own IP, routing table, network interfaces, firewall rules etc.
-> So multiple container can listen to port 80 internally because they are isolated.
-> without `net` namespace
	- Processes use the network stack of the host.
	- Same interfaces, routing table etc
	- Binding conflicts happen directly on host(Container can listen of their own port 80)

##### 3. `PID`
-> Gives separate PID space.
-> inside a container a process may appear as 1, but in host it may appear as 1234.
-> Processes inside one PID namespace usually cannot see processes from another namespace.
-> without `PID`
	- Processes see host PIDs.
	- They can see host processes in tools like `ps`.
	- No isolated process tree.

##### 4. `UTS`
-> Gives each container separate host name, domain name
-> Without UTS namespace:
	 - Containers share the host hostname.
	 - If a container changes hostname, `the host hostname changes too`.
    

-> With UTS namespace:
	 - Each container can have its own hostname.
	 - Example:
		 - Container A → `web-server`
		 - Container B → `db-server`
		 
#####  5. `IPC`
->  Controls:
	- shared memory
	- message queues
	- semaphores

-> These are mechanisms processes use to communicate.
-> Without IPC namespace:
	- Containers share IPC resources with host.
	- A process in one container may access shared memory/message queues created by another process or the host.

-> With IPC namespace:
	- PC resources are isolated.
	- Shared memory inside one container is invisible to others.

##### 6. `USER`
-> Controls:
	- user IDs (UIDs)
	- group IDs (GIDs)
-> Without user namespace:
	- IDs inside container are the same as host.
	- If container process runs as root (`UID 0`):
    - it is actually root on host too.

-> That is dangerous.
-> With user namespace:
	- IDs are mapped.
-> Example:
	- Inside container:
	    - process thinks it is root (`UID 0`)
	- On host:
		- mapped to unprivileged UID like `100000`

-> So:
	- container gets “fake root”
	- host stays protected

##### 7. `CGROUP`
-> Controls visibility of cgroups.
-> cgroups themselves are for:
    - CPU limits
    - memory limits
    - process limits
    - I/O limits

-> Without cgroup namespace:
	- Container can see host cgroup hierarchy.
	- Processes may observe resource structures of host and other containers.

-> With cgroup namespace:
	- Container sees only its own cgroup subtree.
	- Makes resource isolation appear cleaner from inside container.
-> Example:  
	- Inside container:

```
cat /proc/self/cgroup
```

-> Without cgroup namespace:
	- might show full host hierarchy

-> With cgroup namespace:
	- shows only container-related cgroup paths
