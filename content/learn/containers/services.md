## Services

Services allow you to perform end-to-end integration tests and are run in
seperate containers. Services can be databases, queue servers or perhaps your
own custom API server.

When using services, wercker makes sure that the containers are able to
communicate with each other. Basic service discovery is also implemented
through DNS, which is standard behaviour from Docker. Docker will also inject
several environment variables in the main container that contain useful

You can read more about linking containers
[here](/docs/services/linking-services.html).


### Example

```no-highlight
# wercker.yml

services:
    - mongodb
    - redis

box:
    id: mies/rethinkdb
    env:
        USERNAME: foo
        PASSWORD: bar
build:
	(...)
```

The above configuration will load two services, mongodb and redis, both default
Docker containers from Docker Hub, and both using the latest versions.  Similar
to non-service containers, you might require environment variables which you
need to inject inside the container. This could be for instance a
username/password combination. You can use the env clause to do exactly that.

[&lsaquo; Using Containers](/learn/containers/using-containers.html "nav previous containers")
