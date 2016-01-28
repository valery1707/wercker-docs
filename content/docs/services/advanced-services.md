---
tags: services
---

## Advanced services

This article describes advanced usage of service containers within wercker.

### Injecting environment variables in services

Often type services such as databases need environment variables defined
to run. Typical examples are usernames and passwords. As such you probably
want to start off with being explicit in defining your service containers and
reference them through an id:

```yaml
services:
    - id: mongodb
```

Next you want to the pass along additional environment information, for instance a username and password:

```yaml
services:
    - id: mariadb
      env:
        MYSQL_ROOT_USERNAME: myusername
        MYSQL_ROOT_PASSWORD: mysecretpassword
```

### Custom entrypoint command for services

It could be that the Docker container that you are using for a service
does not have an `ENTRYPOINT` or command to run upon launching the container.

You can specify a command for your container to run on launching in your
`wercker.yml` as follows:

```yaml
  services:
    - id: shannon/awesome-service
      username: $USERNAME
      password: $PASSWORD
      tag: latest
      cmd: my_amazing_command
```

Here we use a the container `awesome-service` by the user `shannon` and define
the command to be run when launching the container ` my_amazing_command`.

### Per-pipeline services

Sometimes you want a service to be only available in a specific pipeline
as opposed to a global service. You can define services on a per-pipeline
basis as follows:

```yaml
build:
  services:
    - id: mariadb
      username: $USERNAME
      password: $PASSWORD
      tag: latest

  box:
    id: google/golang
    steps:
       # Build the project
      - script:
          name: go build
          code: |
            go build ./...
```

Here we define the `mariadb` service to be only available in the [build pipeline](/learn/pipelines/introduction.html).

### Local services

You can develop your services locally using local services. The service syntax
is largely the same, except we add a url field, which points to the service you
want to use on disk.

Below is an example of a project that uses a local service:

```yaml
services:
    - redis
    - id: bestservice
      url: file://../api#dev
      cmd: python /pipeline/source/app.py
box: python:2.7
dev:
  steps:
    - pip-install
    - internal/watch:
        name: start web server
        code: python app.py
        reload: false
```

The service id `bestservice` has special meaning here. We'll use the ID to set up
the docker link, so inside your client container, you can query DNS for the
service host.

The `url` field should be a file pointer of the form
`file://<path>#<pipeline>`. The path can be absolute or relative, and the
fragment should be the pipeline of the service to run. In the below service
YAML, `dev` will be run when we start the service.

```yaml
services:
    - redis
dev:
  box: python:2.7
  steps:
    - pip-install
    - internal/watch:
        name: start API server
        code: |
            python app.py
```

Running wercker on the above example YAML will first run the `bestservice`, as
if it were a normal build, and then commit the image. Next, it'll start the
redis service and the `bestservice` image we committed earlier. Finally, it'll
start the python image, and link it with the services.

Because the way we commit the image, you'll need to give it a command to run
when it starts. Currently, environmental variables are not exposed in the
service box, so you'll need to give it the absolute path to the source
directory.

You'll also need to add any services your services depend on to your client
YAML, as we don't currently inspect the service YAML to find out which services
it depends on.
