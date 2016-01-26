---
tags: steps, registry
---

## Creating steps

If you cannot find a step which solves your particular "problem" in the
[step registry](https://app.wercker.com/#explore/steps/search/), then you can
create your own step and publish it. Steps are similar to any other projects on
wercker but instead of deploying to a cloud provider, you deploy to the step
registry in order to make the step available.

To be able to publish a step, you first need a wercker application containing
the following files:

* The project needs to include a `run.sh` file which is the entry-point of your
step.
* The project needs to include a step manifest file call `wercker-step.yml`.

Though technically a step can be written in *any* language, we
recommended writing them in `bash` or in `golang`. The former is usually
installed on most Docker containers whereas the latter compiles to a
single binary. Both programming languages do not require any
dependencies or libraries to be present that might not be installed in
various Docker containers people use, making them quite portable. If you
do create a step in a different programming language, and require certain
run time components, make sure to document this in the step README.

### The Step Manifest file

The step manifest file defines the configuration of your step. Below an example
of a wercker step manifest which we'll go over:

```yaml
name: slack-notifier
version: 1.0.1
description: Posts wercker build/deploy status to a Slack channel.
keywords:
  - notification
  - webhook
  - slack
properties:
  url:
    type: string
    required: true
  channel:
    type: string
    required: false
  username:
    type: string
    required: false
  notify_on:
    type: string
    default: all
    required: false
  icon_url:
    type: string
    required: false
```

The `name` field is the name of your step. Together with your username this is
the unique identifier of your step (`username/name`).

The `version` field is the specific version of the step when deploying. This
field needs to be unique for your step and must adhere to the [semantic version
scheme](http://semver.org). Your first version would be `0.1.0` and each minor
change would bump up the last digit by one. 

Only `name` and `version` are required. All the following properties are
optional, though we encourage people to use them.

The `description` field is the description for the step. We recommend using a
small single line or single paragraph description, all other documentation
should be in the `README.md`.

The `keywords` fields contains an array of strings with keywords of this step.
We recommend a few tags (at most 5) to describe the step.

The `properties` field contains metadata describing the parameters that are
available for the step. This is a map, where the key is the name of the step,
and the value is a object with the following properties:

- `type` - the type of the data of the parameter. Currently supported: `string`.
- `required` - boolean indicating if the parameter is required or not (currently
 not enforced).
- `default` - value that gets used, if no parameter was provided through the
wercker.yml

### The run.sh file

The `run.sh` file contains the entrypoint your step logic. This should be
`bash` code in the `run.sh` file itself. If you want to create a more complex
application in a different language, than call this from within the `run.sh`
file.

For each property you specified in your `wercker-step.yml`, wercker sets a 
corresponding environment variable. For example, the value of the `url` property
would be made available in the `$WERCKER_SLACK_NOTIFIER_URL` environment variable.

Notice that any hyphens you use in your parameter names will be transformed to
underscores.

### The Readme

If a `README.md` is present in your step folder, the registry will display
this such that people can easily deduct what your step does and how to use it.

### Publishing your step

> Note: currently it is only possible to publish steps using the old
infrastructure. However, published steps will continue to work on both
[stacks](/docs/pipelines/stacks.html).

Publishing steps is done by `deploying` your step to the registry. To do so
create a project on wercker for your step as you would with any other project.

Next, add a deploy target but pick the *wercker directory*. You can now deploy
successful builds to the registry. Make sure to bump the version number when you
want to deploy a new iteration of your step.

You can check out the complete repository of the wercker slack
notification step on [GitHub](https://github.com/wercker/step-slack)
