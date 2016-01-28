## Global Options

This section provides an overview of all available global options. Options or
flags that need additional explanation will also be outlined here.

```no-highlight
GLOBAL OPTIONS:
   --environment "ENVIRONMENT"   specify additional environment variables in a file
   --verbose                     print more information
   --no-colors                   wercker output will not use colors (does not apply to step output)
   --debug                       print additional debug information
   --journal                     Send logs to systemd-journald. Suppresses stdout logging.
   --auth-token                  authentication token to use
   --help, -h                    show help
   --version, -v                 print the version
```

***
***

#### <a name="environment" class="anchor"></a>Environment

`--environment`

Specify additional environment variables in a file. Read more about using
environment variables [here](/cli/configuration/environment-variables.html).

***
***

### <a name="flags" class="anchor"></a> Build & Dev flags

This section contains flags that can be used when building or developing
locally using [wercker dev](/cli/usage/developing.html) or
[wercker build](/cli/usage/building.html).

```no-highlight
OPTIONS:
   --working-dir 					Path where we store working files.
   --build-dir "./_builds"				Path where created builds live.
   --cache-dir "./_cache"				Path for storing pipeline cache.
   --container-dir "./_containers"			Path where exported containers live.
   --project-dir "./_projects"				Path where downloaded projects live.
   --step-dir "./_steps"				Path where downloaded steps live.
   --deploy-target 					The deploy target name. [$WERCKER_DEPLOYTARGET_NAME]
   --docker-host 					Docker api endpoint. [$DOCKER_HOST]
   --docker-tls-verify "0"				Docker api tls verify. [$DOCKER_TLS_VERIFY]
   --docker-cert-path 					Docker api cert path. [$DOCKER_CERT_PATH]
   --docker-local					Don't interact with remote repositories
   --direct-mount					Mount our binds read-write to the pipeline path.
   --publish [--publish option --publish option]	Publish a port from the main container, same format as docker --publish.
   --enable-gitignore					Parse gitignore file to ignore files in your build
   --commit 						Commit the build result locally.
   --tag 						Tag for this build. [$WERCKER_GIT_BRANCH]
   --message 						Message for this build.
   --artifacts						Store artifacts.
   --no-remove						Don't remove the containers.
   --store-local					Store artifacts and containers locally.
   --store-s3						Store artifacts and containers on s3.
   --aws-secret-key 					Secret access key. Used for artifact storage.
   --aws-access-key 					Access key id. Used for artifact storage.
   --s3-bucket "wercker-development"			Bucket for artifact storage.
   --aws-region "us-east-1"				AWS region to use for artifact storage.
   --source-dir 					Source path relative to checkout root.
   --no-response-timeout "5"				Timeout if no script output is received in this many minutes.
   --command-timeout "25"				Timeout if command does not complete in this many minutes.
   --wercker-yml 					Specify a specific yaml file.

```

***
***

#### <a name="docker-local" class="anchor"></a>Docker local

`--docker-local`

This flag can be used with either [wercker dev](/cli/usage/developing.html) or
[wercker build](/cli/usage/building.html). When using this flag, wercker will
not attempt to connect to a remote repository when pulling or pushing images,
but will instead look for container images locally, or when using the
[internal/docker-push](/docs/steps/internal-steps.html#docker-push), it will
push images to the local repository.


***
***

#### <a name="attach-on-error" class="anchor"></a>Attach on error

The `--attach-on-error` flag can be added to both the `wercker build` as
well as the `wercker dev` command. If a step fails in your pipeline it
will re-initiate the container and drop you into a shell inside of the
container. This flag is great for debugging and inspect the environment.

You can use it as follows:

```no-highlight
wercker dev --publish 5000 --attach-on-error
```

***
***

#### <a name="publish" class="anchor"></a>Publish

Used together with [wercker dev](/cli/usage/developing.html). Exposes a port from
the container to the host.

```no-highlight
wercker dev --publish 1337
```

***
***

#### <a name="no-remove" class="anchor"></a>No remove

`--no-remove`

When developing locally, you can opt not to remove the development containers
locally.

***
***

#### <a name="store-s3" class="anchor"></a>Store S3

`--store-s3`

You can store your container images and artefacts on Amazon S3 while building
or developing. You'll also need to specify:

##### <a name="aws-secret-key" class="anchor"></a>

`--aws-secret-key`

When storing artefacts on S3, this key needs to be set.

##### <a name="aws-secret-access-key" class="anchor"></a>

`--aws-secret-access-key`

When storing artefacts on S3, this key needs to be set.

##### <a name="s3-bucket" class="anchor"></a>

`--s3-bucket`

When storing artefacts on S3, specify which bucket it needs to be saved to.

##### <a name="aws-region" class="anchor"></a>

`--aws-region`

When storing artefacts on S3, specify which region wercker should use.

#### <a name="enable-gitignore" class="anchor"></a>Enable gitignore


`--enable-gitignore`

When building a container, don't include files that are inside your `.gitignore` to your container. Enabled by default by `wercker dev` and `wercker build`. Disabled by default on `wercker deploy`. To disable set to false as so `--enable-gitignore=false`.

***
***
