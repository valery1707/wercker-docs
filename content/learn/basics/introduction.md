## Introduction to wercker

Wercker is a [Docker](http://docker.com/)-based platform for developing,
building and delivering your applications in the modern world of microservices,
containers and cloud.

Wercker provides you with a toolchain and cloud platform to speed up your
development process. It allows you to build apps for the 21st century by
containerizing your code and automating your development pipelines.

### Why wercker

The landscape of production has changed: monolithic is out, loosely coupled
microservices are in. Modern applications consist of multiple moving parts, but
most of the existing developer tooling we use was designed and built in the
world of monolithic applications.

Working with microservices poses new challenges: your applications now consist
of multiple processes, multiple configurations, multiple environments, and more
than one codebase.

To fully leverage the advantages of microservices, they should be managed
carefully.

Wercker lets you do just that. By setting up automated development pipelines,
very much in the spirit of “release early, release often”, you can build and
deploy your services with just a git push. You can then let wercker compile and
run any other steps that are necessary to build your project before it gets
deployed to a [target](http://devcenter.wercker.com/docs/deploy/steps.html) of
your choosing.

Under the hood wercker leverages Docker containers to not only allow automated
pipelines, but also isolated environments to run code in. Wercker runs your
code in a container and takes it through what we call [steps](http://devcenter.wercker.com/docs/steps/index.html) and saves the output as a
container.

Wercker also works for developers working on websites, blogs or apps that are
not necessarily as complex. Because wercker is also a workflow and not only a
platform, we encourage you to start using wercker from the get-go with [wercker
dev](http://blog.wercker.com/2015/05/15/Introducing-local-development.html).
This sets you up with a container locally and allows you to start developing in
that container, without changing your existing workflow.

[Workflow &rsaquo;](/learn/basics/workflow.html "nav next basics")
