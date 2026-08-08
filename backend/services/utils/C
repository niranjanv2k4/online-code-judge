FROM alpine:latest

RUN apk add --no-cache gcc musl-dev

RUN adduser -D sandbox

RUN mkdir -p /home/sandbox/workdir/
RUN chown -R sandbox:sandbox /home/sandbox/workdir

WORKDIR /home/sandbox/workdir
USER sandbox