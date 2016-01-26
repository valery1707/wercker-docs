## Using steps

You define your steps in the wercker.yml file for your application.

```yaml
box: wercker/python
services:
    - wercker/mongodb
build:
  steps:
    # execute jshint
    - jshint
deploy:
  steps:
    # Execute the s3sync deploy step, a step provided by wercker
    - s3sync:
        key_id: $AWS_ACCESS_KEY_ID
        key_secret: $AWS_SECRET_ACCESS_KEY
        bucket_url: $AWS_BUCKET_URL
        source_dir: build/
```

Steps can have parameters. Note that some options are optional and some
are required. Consult the **readme** of the step to see the available
parameters.

An example of a step with parameters:

```yaml
build:
  steps:
    - npm-install@1.0.5:
        package: jshint
        strict-ssl: false
    - npm-test
```

This will pass two options to the **npm install** step, `package` and `strict-ssl`.

Apart from predefined steps there is also the notion of **custom**, or
inline, script steps.

### Script steps
Custom build steps, which are basically bash scripts defined via the 'script' clause,
require  **name** and **code** elements:

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
that the results of these commands are available in the wercker ui and
will be exposed as a build step under the name `echo python
information`.

[&lsaquo; Introduction to steps](/learn/steps/introduction.html "nav previous steps")
[After steps &rsaquo;](/learn/steps/after-steps.html "nav next steps")
