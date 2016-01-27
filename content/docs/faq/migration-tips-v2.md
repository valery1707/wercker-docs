---
tags: migrating
---

## Migration Tips to wercker v2

In this article we go over the items to take into consideration when
migrating your application to [wercker v2](http://blog.wercker.com/2015/04/02/Introducing-our-docker-stack.html) (Ewok Edition).

### Table of contents

* What is this Docker-based stack (Ewok)?
* How do I migrate to the new Docker-based stack?
* How do I get started with the Docker stack and containers?
* Git Submodules
* Using sudo

### What is this Docker-based stack (Ewok)?

Ewok is the code name of our new Docker stack. Instead of Linux containers
you can now use Docker containers for your build and deploy pipelines.
You can [pull](/docs/containers/private-containers.html) and [push](/docs/containers/pushing-containers.html)
containers from the [Docker Hub](/docs/containers/index.html) or from privates registries.

### How do I migrate to the new Docker-based stack?

On the settings page for your project there is an *infrastructure* section
with a drop-down menu. You can select **version 5** here for the Docker-base stack.
**Note** that a [wercker.yml](/docs/wercker-yml/creating-a-yml.html) for
[classic](/docs/wercker-yml/wercker-classic.html) boxes does not work for
with the Docker-based stack! (see the next point)

### How do I get started with the Docker stack and containers?

The classic `boxes` system no longer works in wercker v2. Instead, you
can now use Docker containers in your
[wercker.yml](/learn/basics/configuration.html).

In the example below the official [Ruby
container](https://registry.hub.docker.com/u/library/ruby/) from the
Docker Hub is used.

```yaml
box: ruby
```

If you want to use a container from a different user you specify this as
follows:

```yaml
box: nodesource/node
```

Here we use the nodejs [container](https://registry.hub.docker.com/u/nodesource/node/) from
[Nodesource](https://nodesource.com/).

If we want to specify a specific version or tag we do that in the
following way:

```yaml
box: nodesource/node:trusty
```

This is the Ubuntu Trusty Tahr (14.04) image with the Nodesource
binaries baked in.

### Known hosts

In the [classic stack](/docs/wercker-yml/wercker-classic.html) the fingerprints of bitbucket.org and github.com
were already added to the known\_hosts file on the *boxes*. Docker containers may or may not
also have these. If you encounter the message `host_key verification failed`
during your pipeline run, then you need to add the following step
[add-to-know_hosts](https://app.wercker.com/#applications/521764dde36a64ff110022f2/tab/details)
to your wercker.yml

### Git Submodules

Submodules are not supported with v2 out of the box you can however initialize
submodules through a script step as explained below:

```yaml
    - script:
        name: initialize git submodules
        code: |
            cd ..
            git submodule update --init --recursive
```

### Using Sudo

The `sudo` command is no longer supported in wercker v2 and effectively
does nothing when used.

### Deployment

As all build artifacts are effectively containers deploy targets other
than custom are no longer supported. Please note that if you update a
project to make use of Docker (Ewok version) and this project has
auto-deployment, this deploy will most likely fail. We will update our documentation in
the future on how to deploy these containers.
