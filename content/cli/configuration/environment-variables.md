---
tags: environmentvariables
---

## Local environment variables

When running `wercker build` locally you can pass environment variables defined
on the host machine to the container. All environment variables that start with
`X_` will be made available in the container, with the `X_` prefix removed from
the key in the container.

In the following example an environment variable is defined before running
`wercker build`. This environment variable will be available as `$TOKEN` inside
the container:

```no-highlight
export X_TOKEN="secret"
wercker build
```

It is also possible to create an `ENVIRONMENT` file that contains multiple
environment variables. Wercker will then automatically synchronize the
variables defined in this file with your containers.  If you want to use
multiple environment files, you can specify the file to be used by adding the
`--environment` flag while running `wercker build` command:

```no-highlight
wercker --environment wercker.env build
```

The keys in the environment file also need to start with `X_`.
