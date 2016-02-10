## Internal steps
Internal steps are developed by wercker and are baked into the wercker cli as
these interact with the Docker API that is external from the container. From a 
technical perspective, it is not possible to interact with the Docker daemon
from within a container. As such we have created these internal steps.

This article will explain all the different internal steps that are available:

* [internal/docker-push](#docker-push)
* [internal/docker-scratch-push](#scratch-push)
* [internal/store-container](#store-container)
* [internal/watch](#internal-watch)
* [internal/shell](#internal-shell)

### <a name="docker-push"></a>internal/docker-push

This step will take your **current** pipeline image (specified either globally
or per pipeline) in it's current state and push that as an image to a Docker
registry. That includes the result of all the wercker steps that have been run
up until that point.

```yaml
deploy:
  steps:
    - internal/docker-push:
        username: $USERNAME
        password: $PASSWORD
        repository: turing/bar
        tag: my-amazing-tag
        ports: "5000, 8080"
```

The `internal/docker-push` step supports the following properties:

- `username`: The username which will be used to authenticate to the registry.
- `password`: The password which will be used to authenticate to the registry.
- `email`: The e-mail address which will be used during authentication to the
  registry.
- `repository`: The name of the repository. When using a non Docker Hub
  repository, prefix the value with the host of the private repository.
- `tag`: A space or comma separated list of Docker tags that will be applied to the built container. Wercker will automatically apply a tag with the build number, and if `tag` is left blank wercker will use the docker default of `latest`.
- `force-tags`: Force apply tags on docker images built by wercker (see [docker documentation](https://docs.docker.com/engine/reference/api/docker_remote_api_v1.20/#tag-an-image-into-a-repository)). Defaults to true.
- `ports`: Comma separated list of ports which can be exposed. The number can
  end with `/tcp` or `/udp`. If omitted,`/tcp` will be used. This is the
  equivelant of `EXPOSE` in a Dockerfile.
- `volumes`: Comma separated list of volumes which will be exposed. This is the
  equivelant of `VOLUME` in a Dockerfile.
- `working-dir`: Override the working directory of the container. This is the
  equivelant of `WORKDIR` in a Dockerfile.
- `author`: Set the author of the container. This is the equivelant of
  `MAINTAINER` in a Dockerfile.
- `cmd`: Set the cmd for the new container. This is the equivelant of `CMD` in
  a Dockerfile. We only support a single string value, which will be converted
  to exec form using [go-shlex](https://github.com/flynn-archive/go-shlex).
- `entrypoint`: Set the entrypoint for the new container. This is the
  equivelant of `ENTRYPOINT` in a Dockerfile. We only support a single string
  value, which will be converted to exec form using [go-shlex](https://github.com/flynn-archive/go-shlex).
- `disable-sync`: Disable syncing of the environment variables before running
  this step. Some containers do not support syncing of environment variables,
  set this property to `true` for these containers. This does mean that any
  exported environment variables will not be available for use in these
  properties.
- `message`: Set a comment on the layer.
- `registry`: The endpoint of the registry. Leave empty for pushes to the
  Docker hub. For pushes to other registries, it should start with `https://`
  and should be the same as the prefix of the `repository`.
- `user`: String value specifying the user inside the container.
- `env` - A list of environment variables in the form of `["VAR=value"[,"VAR2=value2"]]`. Can be delimited by spaces or commas.
- `labels` - Adds a map of labels to a container. To specify a map, pass your labels into the `wercker.yml` file in this format `["LABEL=label"[,"LABEL2=label2"]]`. Can be delimited by spaces or commas.
- `stopsignal` - Signal to stop a container as a string or unsigned integer. `SIGTERM` by default.

It is possible to use environment variables inside all properties, these will
be expanded. Environment variables that are exported during a build are also
available, unless `disable-sync` is set to `true`.

More information about the internal/docker-push step can be found
[here](/docs/containers/pushing-containers.html).

### <a name="scratch-push" class="anchor"></a>internal/docker-scratch-push

The `docker-scratch-push` step works the same as the normal `docker-push` step.
The main difference is that this step uses a
[scratch](https://docs.docker.com/articles/baseimages/) base image provided by
Docker. This image contains only the bare essentials, and as such is very
lightweight in terms of size. To set it up correctly however, it requires some
additional steps.

It injects the files present in the `$WERCKER_ROOT` environment variable into
the root of the container.

To help you build your first scratch-enabled application, you can follow our
[tutorial](/quickstarts/advanced/building-minimal-containers-with-go.html)

### <a name="store-container" class="anchor"></a>internal/store-container
The `internal/store-container` step will store the result of a build as a
container artifact. You will then be able to download that container and
execute it locally.  This is useful if you want to [pull your
container](/cli/usage/pulling-builds.html) to introspect your
build.

### <a name="internal-watch" class="anchor"></a>internal/watch
The `internal/watch` step gives you a long-running step that can be configured
to reload on file changes. A very common use case for this step is front-end
development, here's an example from our getting-started-nodejs project:

```yaml
box: nodesource/trusty
dev:
  steps:
    - npm-install
    - internal/watch:
        code: node app.js
        reload: true
```

With this dev pipeline we run one initial setup step, `npm-install`, to prepare
our container's environment, then we execute our node app, reloading on changes.

To run this, you would do:

```no-highlight
wercker dev --publish 5000
```

And once it loads, browse to your docker host (either localhost on linux, or
with boot2docker usually  on 192.168.59.103) on port 5000 to see your app running.
For your convenience, we'll tell you the IP once the step runs.

As you make changes to your code, the app will be reloaded, but the npm-install
steps will not be run again.

Without the "reload: true" the code will only be run once, which is useful if
your development server has its own reloading semantics (or is only loading
static files).

### <a name="internal-shell" class="anchor"></a>internal/shell
The `internal/shell` step is pretty simple: it drops you into a shell as soon
as the step is run.

You can use it much the same way as `internal/watch`. If you want to run a
service, but be able to mess with different flags for testing, just CTRL-C the
service and restart it however you want.

You can also use it as a way to inspect the state of the system between steps,
drop into a shell, and look around.

Here's a use case where you're checking some log entries:

```yaml
box: nodesource/trusty
dev:
  - npm-install
  - internal/shell:
      cmd: /bin/sh  #defaults to /bin/bash
      code: |
        # some code to automatically run in your shell session
        # before you start interacting
        cd /var/log
```

