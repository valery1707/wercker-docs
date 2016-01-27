---
tags: golang
---

## Golang

This article describes how to get started with the `go` programming
language and wercker.

### Table of Contents

* The box
* Useful steps
* Complete wercker.yml
* Sample application

### The box

The Docker Hub has a
[container](https://registry.hub.docker.com/_/golang/) that has multiple versions of `go`
installed. There is also an official Google
[container](https://registry.hub.docker.com/u/google/golang/) available
as well. If you want to cross compile using
[gox](https://github.com/mitchellh/gox) you can leverage the container created by
[tcnksm](https://registry.hub.docker.com/u/tcnksm/gox/).

Define your selected container in your [wercker.yml
file](/learn/basics/configuration.html) using the `box` clause.

```yaml
box: google/golang
```

### Useful steps

* [golint](https://app.wercker.com/#applications/548b1cef6b3ba8733d6d4db3/tab/details)
* [s3sync for syncing your binaries](https://app.wercker.com/#applications/51c82a063179be4478002245/tab/details)
* [setup-go-workspace](https://app.wercker.com/#applications/51fa5e6ba4037f7171000f75/tab/details)

#### golint

A lint step for go source code that uses
[golint](https://github.com/golang/lint).

Usage:

```yaml
build:
    steps:
        - golint
```

#### s3sync

As compiled go applications are single binaries, they are easily
shippable and deployable to for instance s3. You can leverage the
s3sync step in the wercker marketplace to do this. To use this step,
you will need your AWS access keys and the bucket that you would like to deploy to:

```yaml
deploy:
    steps:
    - s3sync:
        # use the build folder in the wercker pipeline
        source_dir: build/
        # delete remote files that are no longer in your local folder
        delete-removed: true
        # set up environment variables
        bucket-url: $AWS_BUCKET_URL
        key-id: $AWS_ACCESS_KEY_ID
        key-secret: $AWS_SECRET_ACCESS_KEY
```

### Complete wercker.yml

Below you can find the entire `wercker.yml` file for a golang application.

```yaml
# use the official google golang container

box: google/golang

# Build definition
build:
  # The steps that will be executed on build
  steps:

    # Sets the go workspace and places you package
    # at the right place in the workspace tree
    - setup-go-workspace

    # golint step!
    - wercker/golint

    # Build the project
    - script:
        name: go build
        code: |
          go build ./...

    # Test the project
    - script:
        name: go test
        code: |
          go test ./...

deploy:
    steps:
    - s3sync:
        source_dir: build/
        delete-removed: true
        bucket-url: $AWS_BUCKET_URL
        key-id: $AWS_ACCESS_KEY_ID
        key-secret: $AWS_SECRET_ACCESS_KEY
```

### Sample application

You can checkout and clone a sample application in golang at the
following location:

[getting-started-golang](http://github.com/wercker/getting-started-golang)
