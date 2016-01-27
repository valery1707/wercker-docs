## Introduction to containers

Software containerization is a way to isolate your applications and
services from the rest of the operating system (or other containers).
Not only are containers an isolated unit of work, they're also portable.


### Docker

Wercker uses [Docker](http://docker.com) containers to
not only run your pipelines, but also stores your build artifacts as
containers.

This means that you can ship and deploy these containers to your servers.

![image](/images/portable-container.svg)

Within pipelines, containers are used to run your language stack (for
instance python) but also services such as a database.

> Every wercker pipeline runs inside a container

In the next couple of sections we will explain where to get your
containers from, and how to use them.

[Using Containers &rsaquo;](/learn/containers/using-containers.html "nav next containers")
