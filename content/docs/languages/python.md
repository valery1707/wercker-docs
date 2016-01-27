---
tags: python
---

## Python

This article describes how to get started with the `python` programming
language and wercker.

### Table of Contents

* The box
* Useful steps
* Complete wercker.yml
* Sample application

https://registry.hub.docker.com/_/python/

### The box

The Docker Hub has a
[container](https://registry.hub.docker.com/_/python/) which has by default a 3.4.x version of python installed, through tags you can select specific versions of Python/containers (for example: python:2-slim).

Define your selected container in your [wercker.yml
file](/learn/basics/configuration.html) using the `box` clause.

```yaml
box: python
```

### Useful steps

* virtualenv
* pip-install
* install-packages

#### virtualenv

A step that creates a virtual environment and activates it.

Usage:
```yaml
build:
    steps:
        - virtualenv
```


#### pip-install

Install your packages via the pip-install step. Assuming you have a requirements.txt in the root, it's
as easy as:

```yaml
build:
    steps:
        - pip-install
```

#### install-packages

Many of the docker containers are based on Ubuntu/Debian, you can use the install-package step
to install additional software. Usage:

```yaml
build:
    steps:
        - install-packages:
            packages: openssh-client
```

### Complete wercker.yml

Below you can find the entire `wercker.yml` file for a python application.

```yaml
# use a small python 2.x container
box: python:2-slim

# Build definition
build:
  # The steps that will be executed on build
  steps:
    # A step that executes `pip install` command
    - pip-install

    # A custom script step, name value is used in the UI
    # and the code value contains the command that get executed
    - script:
        name: python unit test
        code: |
          python app_test.py
```

### Sample application

You can checkout and clone a sample application in python at the
following location:

[getting-started-python](http://github.com/wercker/getting-started-python)
