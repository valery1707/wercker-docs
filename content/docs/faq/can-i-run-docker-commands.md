---
tags: docker
---

## Can I execute Docker commands inside my pipelines?

The short answer is no.

On the Docker-enabled stack, wercker runs your job **inside** a Docker container.
This means that Docker commands are *not* available as these would have to be made available outside the container which is insecure.

Instead, we provide you with a set of [internal steps](/docs/steps/internal-steps.html) that function as a wrapper for some of the Docker commands, like pushing a container to a registry.
