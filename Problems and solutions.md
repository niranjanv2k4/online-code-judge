
# 1. Infinite Execution / Hanging Programs
-> Some of the program that we try to run in a program might hang or enter into a state of infinite execution intentionally or unintentionally. One or two containers hanging like this may not be a problem, But with enough of these can cause significant issues to the system including DoS, system freezes, and can cause exhaustion of resources like CPU, Storage and so on.
> [!danger] Hostile code
>```c
>#include <stdio.h>
>
> int main() {
 >   printf("START\n");
 >   while(1) {
 >   }
 >   return 0;
 >}
 >```
 
 -> We should always assume that the program are buggy and hostile and need to implement security against such issues.
 -> What we need to happen in such a scenario
	 - execution exceeded allowed time
	 - terminate execution
	 - cleanup resources
	 - return TIMEOUT status
-> Solution logic
>[!Code] LOGIC
>```
>If execution continues longer that expected
>		terminate and kill the container
>```

-> The problem is the back-end must monitor the time of execution independently of the execution itself, without these the back end loses the control of the execution.
-> We need a timeout system, time out systems are external systems, they observe the execution from outside.
-> **SOLUTION: USE A MULTI THREADED ARCHITECTURE**

## 2. Running containers as non-root
-> By default docker container is ran as the root user of the container.
-> Container processes share the host kernal.
-> Example:
	- Suppose
		- container ran as root
		- Docker daemon configured badly.
		- `/var/run/docker.sock` exposed.
		- privileged container enabled.
		- Kernel vulnerabilities exist.
	- Attack may
		- escape the container.
		- become the host root.
-> Without root privilege main of the malicious operation will fail.
	- system directories are protected.
	- package manage access is restricted.
	- permission escalation is harder.
	- exploit chains are reduced.
>[!danger] Hostile code
>```c
>int main(){
>	system("apt install something);
>}
>```

-> If the container is ran as root, this will work.
**-> SOLUTION : RUN THE CONTAINER AS A NON_ROOT**

## 3. Resource limiting with Docker flags

### 3.1 creating of large files

>[!danger] Hostile code
>```c
>int main(){
>	FILE *f = fopen("huge.txt", "w");
>	while(1){
>		fprintf(f, "AAAAAAAA");
>	}
>}
>```

-> If you check this, even a not-root user can still cause the container to fail and if not configured properly this will affect the system.
-> This is called `infinite disk write`
-> Eventually container file system fills, docker storage fills, host disk fills.

**-> SOLUTION: USE A READ-ONLY FILE SYSTEM TO PREVENT THE WRITING IN OTHER DIRECTORIES AND A CAP VALUE FOR THE CURRENT DIRECTORY WHERE THE PROCESS CAN WRITE**

-> use a mount like `--mount type=tmpfs, destination=/workdir, tmpfs-size=<limit>`
-> NOTE: `tmpfs` is a RAM backed file system.

### 3.2 Creating process with huge heap and variable data
>[!danger] Hostile code
>```c
>int main{
>	while(1){
>		char *p = malloc(10*1024*1024);
>		memset(p, 'A', 10*1024*1024);
>	}
>	return 0;
>}
>```


-> This is an entire different problem that the previous one, previous one file on a particular directory, but this does do consume the file-system space, this consume the memory allocated to a process like the heap space which will not be included in the file system.
-> This can cause the container to grow to a enormous size if unchecked.

**->SOLUTION: USE MEMORY LIMIT THAT A CONTAINER CAN CONSUME FROM THE HOST.

-> use `--memory=256m` to limit the total memory (including the file system discussed earlier) allowed to a container.

-> NOTE: using pid-limit we can prevent fork() bombs, using read-only and mounting using tmpfs we can prevent the file creation, and using memory tag we can prevent the infinite growth of the process memory(heap).

## 4. Disabling the network access
-> Even with the above restriction the container can cause issue to external devices for example with network access the containers or the platform can be used to carry out DDoS attacks.
>[!danger] Hostile code
>```c
>int main(){
>	int result = system("ping -c 1 8.8.8.8);
>	return 0;
>}
>```


-> This is a code which can prove that the containers can access external internet
**-> SOLUTION: DISABLE THE NETWORKING CAPABILITIES FOR THE CONTAINER**

## 5. Restricting the capabilities for the container.
-> What are capabilities?
ans) linux has a traditional super user model, the root user has unrestricted privileges and access on the system. What capabilities are a pieces of the whole privileges where each piece represents a specific privilege or access. That is the set of privileges or access to the system is divided into capabilities so that we can assign only the necessary set of capabilities to a particular process or user. This provide a mode granular control over the system. If this is not present we would have to either give total privilege or access to a process or user or cannot give any of the privilege.
-> Example:
	- ```CAP_NET_BIND_SERVICE - Allows binding to privileged ports.
	- CAP_SYS_TIME - Allows modifying system clock.
	- CAP_DAC_OVERRIDE - Bypass file permission checks.```
-> Capabilities helps to follow the principle of least privilege.
**->SOLUTION: user `cap_drop` and `cap_add` to manage the capabilities of the container**

-> But some process even when no privilege is added to it can gain privilege while executing do to the option like setuid, so to prevent this `USE THE no-new-privilege` to prevent the process or container from gaining privilege after is started as a  non-privileged one.