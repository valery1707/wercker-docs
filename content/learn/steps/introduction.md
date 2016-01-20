## Introduction to steps

Steps make up the wercker pipeline and can either be executed in the build or
deploy phase within the pipeline.

Examples of a **build step** are compilation of your code, running your
unit tests or even static code analysis such as `jshint` or `golint`.

A **deploy step** could be the synchronization of static assets, for
which we've created the [s3sync
step](https://github.com/wercker/step-s3sync/), that takes some Amazon
Web Services
credentials and bucket information and places these assets on Amazon S3.

Finally, there's the notion of *after-steps*, which can be used for
notifications.

[Using steps &rsaquo;](/learn/steps/using-steps.html "nav next steps")
