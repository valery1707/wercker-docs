---
tags: steps
---

## Steps

Steps make up the wercker
[pipeline](/learn/pipelines/introduction.html) and can either be
executed in the [build](/learn/pipelines/available-pipelines.html) or
[deploy](/learn/pipelines/available-pipelines.html) phase within the pipeline.

Examples of a **build step** are compilation of your code, running your
unit tests or performing
[jshint](https://github.com/wercker/step-jshint/).

A **deploy step** could be the synchronization of static assets, for
which we've created the [s3sync step](https://github.com/wercker/step-s3sync/),
that takes some Amazon Web Services credentials and bucket information and
places these assets on Amazon S3.

You define your steps in the [wercker.yml](/docs/wercker-yml/creating-a-yml.html) file
in your application. Steps can have parameters. Some parameters are
optional and some are required. Consult the **readme** of the step to see the
available options.

An example of a step with parameters:

```yaml

build:
    steps:
      - npm-install@1.0.5:
          package: jshint
          strict-ssl: false
      - npm-test

```

This will pass two parameters to the **npm install** step, `package` and `strict-ssl`.

Apart from predefined steps there are also **custom**, or inline
steps. Custom steps are basically bash scripts defined via the 'script' clause,
requiring **name** and **code** elements:

```yaml
# A custom script step, name value is used in the UI
# and the code value contains the command that get executed
- script:
    name: echo python information
    code: |
      echo "python version $(python --version) running"
      echo "pip version $(pip --version) running"
```

This example echos back the **Python** and **pip** versions to us. Note
that the result of these commands area available in the wercker ui and
will be exposed as a build step under the name `echo python
information`.

#### after-steps

Wercker also has the notion of [after-steps](/docs/steps/after-steps.html) ideally suited for notifications.

#### Changing the working directory

Some tools need to be in a certain directory to work, `bundle-install` for example will look for a Gemfile in the current directory and install the gems from that Gemfile. With wercker it is possible to change the working directory for all steps, it is not necessary for the steps developers to add extra code.

To change the working directory of a step you need to add a **cwd** element to the step. You can specify a relative path (relative from `$WERCKER_ROOT`) or a absolute path. Use of environment variables is possible.

```yaml
build:
  steps:
    - bundle-install:
        cwd: src/
```

## Creating your own steps

If you can not find a certain step, you can always create your own.
Similar to applications, steps are defined through a single file called
`wercker-step.yml` and need to be `deployed` to the wercker directory.
Deploying your steps to the wercker directory allows not only **you** to
leverage these steps, but **others** as well.

* [Creating your own wercker steps](/docs/steps/creating-steps.html)

