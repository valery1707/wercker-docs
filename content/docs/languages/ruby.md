---
tags: ruby
---

## Ruby

This article describes how to get started with the `ruby` programming
language and wercker.

### Table of Contents

* The box
* Useful steps
* Complete wercker.yml
* Sample application

### The box

The Docker Hub has various containers for ruby available.
There is a default container that you can find [here](https://registry.hub.docker.com/_/ruby/). For this guide we
we will be using the [phusion passenger container](https://registry.hub.docker.com/u/phusion/passenger-ruby22/) that comes with ruby 2.2.

Define your selected container in your [wercker.yml
file](/learn/basics/configuration.html) using the `box` clause.

```yaml
box: phusion/passenger-ruby22
```

### Useful steps

* [bundle-install](https://app.wercker.com/#applications/51c829d13179be44780020be/tab/details)
* [bundle-package](https://app.wercker.com/#applications/51c829d43179be44780020cf/tab/details)

### Complete wercker.yml

Below you can find the entire `wercker.yml` file for a ruby application.

```yaml
box: phusion/passenger-ruby22
build:
    steps:
        - bundle-install
        - script:
            name: rspec
            code: bundle exec rspec
```
### Sample application

You can checkout and clone a sample application in ruby at the
following location:

[getting-started-ruby](https://github.com/wercker/getting-started-ruby)
