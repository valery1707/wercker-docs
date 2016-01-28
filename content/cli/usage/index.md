---
tags: cli
---

## Overview of Available commands

The wercker command line interface comes with the following commands:

```no-highlight
COMMANDS:
   build, b     build a project
   dev          build a local project
   check-config check the project's yaml
   deploy, d    deploy a project
   detect, de   detect the type of project
   login, l     log into wercker
   logout, l    logout from wercker
   pull, p      pull a build result
   version, v   display version information
   help, h      Shows a list of commands or help for one command

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

### Detect

The *detect* command introspects your projects and generates
[wercker.yml](/learn/basics/configuration.html) files for your
projects.

> Currently go, python, nodejs and ruby are supported in the detect
> command

### Build and Dev

The *build* and *dev* commands execute these pipelines locally. They are
explained in detail here: [build](/cli/usage/building.html) and
[dev](/cli/usage/developing.html).

> Note: the `deploy` command is currently not supported.

### Pulling builds

Using the *pull* command you can download a container from the wercker platform
after which you can use Docker commands to debug this container locally.  Note
that you have to add the
[internal/store](/docs/steps/internal-steps.html#store-container) to your
**wercker.yml**. You can read more about pulling builds [here](/cli/usage/pulling-builds.html)

### Logging in

You can log into wercker with your username and password as follows:

```no-highlight
wercker login
```

This will save a token in your `$HOME/.wercker` folder, so you don't
have to login the next time.

Note that if you've signed up with GitHub you will need a password for the CLI
which you can create on your profile page on wercker.

### Update

You can check if you're running the latest version of the CLI by
running:

```no-highlight
> wercker version

Version: 1.0.54
Git commit: dabc15876b877209047fa926774f97f001afbf43
No new version available
```

When not up to date the CLI will nudge you to download a newer version
of the CLI.

> Note: when upgrading to a new version, the binary will download into the
current working directory. Be sure to replace the current binary. You can find
out where the old binary lives by executing `which wercker`.
