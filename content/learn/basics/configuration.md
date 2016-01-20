## Configuration

Configuring wercker is straightforward. 

Every project needs a **wercker.yml** file present in its directory. It's
where you will define everything needed to **develop**, **build** or **deploy**
your project.

### Wercker.yml

The [wercker.yml](/docs/wercker-yml/index.html) file below shows a complete
build and deploy pipelines for a golang application which is deployed as a
binary to Amazon S3:

```
# use the default golang container from Docker Hub
box: golang
# The steps that will be executed in the build pipeline
build:
  steps:
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

# The steps that will be executed in the deploy pipeline
deploy:
    steps:
        # Execute the s3sync deploy step, a step provided by wercker
        - s3sync:
            key_id: $AWS_ACCESS_KEY_ID
            key_secret: $AWS_SECRET_ACCESS_KEY
            bucket_url: $AWS_BUCKET_URL
            source_dir: build/
```

The **wercker.yml** is where you define your pipelines. **Pipelines take code as
input, run that code through a series of steps, finally producing a
container**. Pipelines will be discussed in further detail in the next section,
but just remember that they are defined inside the **wercker.yml** file.

### Environment variables

You can use environment variables inside your **wercker.yml** to configure how
your app should be developed, built or deployed. Locally this can be achieved
by [creating an ENVIRONMENT](/cli/configuration/environment-variables.html)
file in your project directory. In the web interface, you can create, edit and remove environment variables
using the application settings page. 

Wercker also injects some environment variables by default that you can use
throughout your pipeline. You can read more about which variables get injected
in the [documentation](/docs/environment-variables/index.html).

[&lsaquo; Workflow](/learn/basics/workflow.html "nav previous basics")
[Pipelines &rsaquo;](/learn/pipelines/introduction.html "nav next pipelines")
