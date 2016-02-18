## Getting started with wercker & PHP
This guide is a step-by-step approach to developing, building and deploying a
sample app with wercker within minutes.

While this guide uses PHP, the general concepts explained in this tutorial
apply to every other programming language.

### Requirements
To be able to follow along with this guide, you will need the following things:
* [A wercker account](https://app.wercker.com/users/new/)
* [The wercker CLI](http://wercker.com/cli/install)

### Setting up the app
Before we can start developing, we have to fork and clone the [sample
app](https://github.com/wercker/getting-started-php) into our local development
environment. After you've done that, `cd` into the project directory.

```
$ cd getting-started-php/
```

Next, build and run the app to verify everything is working.

```
$ php -S 127.0.0.1:8000
```

Now in your browser navigate to `127.0.0.1:8000` and you should be
presented with the following json:

```
"{'cities':'San Francisco, Amsterdam, Berlin, New York, Tokyo, London'}"
```

### Developing the app

Now that we've setup our app we can start developing. Our list of cities is a
bit short, so why not add another one in there?  Before we do that however,
let's first take a closer look at the **wercker.yml** file included in your
project folder.

### wercker.yml

The [wercker.yml](/docs/wercker-yml/index.html) is the only config file you
need for using wercker. In it, you will define all your steps needed to
successfully **develop**, **build** and **deploy** your application.

To get started however, we're only interested in **developing** our app, so
let's take a closer look at this `dev` _pipeline_ right now.

#### Dev pipeline

```yaml
# The container definition we want to use for developing our app
box: php
# Defining the dev pipeline
dev:
  steps:
    - install-packages:
      packages: git
    - script:
        name: install phpunit
        code: |-
          curl -L https://phar.phpunit.de/phpunit.phar -o /usr/local/bin/phpunit
          chmod +x /usr/local/bin/phpunit
    - script:
        name: install composer
        code: curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
    - script:
        name: install dependencies
        code: composer install --no-interaction
    - internal/watch:
        code: php -S 0.0.0.0:8000
        reload: true
```

The first line specifies which container image you want to use for your
project.  Since we're developing with PHP, we've already specified a PHP
image for you. These container images are retrieved from [Docker
Hub](https://hub.docker.com/r/library/php/) if no other registry is
specified. You can read more about containers
[here](/docs/containers/index.html).

In the `dev` clause we define what we want to happen in our development
pipeline, which in this case is just one step: `internal/watch`.

`internal-watch` watches your files for changes, and if `reload` is set to
`true` it restarts your app so your changes are reflected immediately. This is
especially useful for when you're developing webapps, as we're doing now.

Let's see these steps in action now and fire up our _dev pipeline_.

### wercker dev

In your project folder, run `wercker dev --publish 8000`. You should see
something similar to the following output:

```no-highlight
--> Executing pipeline
--> Running step: setup environment
--> Executing pipeline
--> Running step: setup environment
Pulling from library/php: latest
Already exists: 7268d8f794c4
Already exists: a3ed95caeb02
Already exists: 38331772e700
Already exists: 74507bbf90f9
Already exists: a3ed95caeb02
Already exists: c6734ca38ed8
Already exists: a3ed95caeb02
Already exists: d0a9f6bf3b17
Already exists: a3ed95caeb02
Already exists: a3ed95caeb02
Already exists: a3ed95caeb02
Already exists: a9c6e2cf4887
Already exists: 2f590771dfac
Already exists: a3ed95caeb02
Digest: sha256:44546b02912ad0afd3639ccc54b841f7fbafdbe4548399513457347cde76da42
Status: Image is up to date for php:latest
--> Running step: wercker-init
--> Running step: install phpunit
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   160  100   160    0     0    809      0 --:--:-- --:--:-- --:--:--   812
100 2745k  100 2745k    0     0  1924k      0  0:00:01  0:00:01 --:--:-- 2543k
--> Running step: install composer
All settings correct for using Composer
Downloading...

Composer successfully installed to: /usr/local/bin/composer
Use it: php /usr/local/bin/composer
--> Running step: install dependencies
Loading composer repositories with package information
Installing dependencies (including require-dev) from lock file
Nothing to install or update
Generating autoload files
--> Running step: watch
--> Reloading on file changes
--> Reloading
--> Forwarding 192.168.99.100:8000 to 8000 on the container.
```

Wercker first checks out your code and then sets up the container environment.
This means that the container will be pulled from Docker Hub and subsequently
started with access to your checked out code. It will then start executing all the
steps that are defined in the **wercker.yml**.

Please note that the IP displayed here could be different for you, as this
tutorial was written using `docker-machine`.

If you navigate to DOCKER_HOST_IP:8000 you should see the same
output as before. That's not very exciting, so let's see our live reloading in
action. In **index.php** add a new city to the array:

```php
<?php
$cities = array("Amsterdam", "San Francisco", "Berlin",
                "New York", "Tokyo", "London", "Singapore");

header('Content-Type: application/json');
echo json_encode($cities, JSON_PRETTY_PRINT);
?>
```

Once you save your changes, the app should automatically reload. If you
refresh your page, our new city should be there! Hurrah!

There are [many more steps](https://app.wercker.com/#explore) to use for
developing your app.  Take a look around, and if you can't find the step you're
looking for, you can always [make your
own](/docs/steps/creating-steps.html).

Now that we're done developing, we want to push our changes and let wercker
build and deploy our app for us.

### Building your app

First, let's revisit our **wercker.yml** again.

```yaml
box: php
dev:
  steps:
   - install-packages:
      packages: git
    - script:
        name: install composer
        code: curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
    - script:
        name: install dependencies
        code: composer install --no-interaction
    - internal/watch:
        code: php -S 0.0.0.0:8000
        reload: true
build:
  steps:
   - install-packages:
      packages: git
    - script:
        name: install phpunit
        code: |-
          curl -L https://phar.phpunit.de/phpunit.phar -o /usr/local/bin/phpunit
          chmod +x /usr/local/bin/phpunit
    - script:
        name: install composer
        code: curl -sS https://getcomposer.org/installer | sudo php -- --install-dir=/usr/local/bin --filename=composer
    - script:
        name: install dependencies
        code: composer install --no-interaction
    - script:
        name: Serve application
        code: php -S localhost:8000 >> /dev/null &
    - script:
        name: PHPUnit integration tests
        code: phpunit --configuration phpunit.xml
```

#### Build Pipeline

We're now interested in what's happening the _build_ pipeline. All of the steps
listed here are **script** steps, which are bash scripts declared inline. We use
these steps to install PHPUnit and Composer, after which we user Composer the dependencies
as described in **composer.json**. Lastly, we serve our application so we can run our tests.

#### wercker build

Now that we have a better understanding of our **wercker.yml** let's go ahead
and let wercker **build** our project. In your project folder, run:

```
$ wercker build
--> Executing pipeline
--> Running step: setup environment
Pulling from library/php: latest
Already exists: 7268d8f794c4
Already exists: a3ed95caeb02
Already exists: a3ed95caeb02
Already exists: a3ed95caeb02
Digest: sha256:44546b02912ad0afd3639ccc54b841f7fbafdbe4548399513457347cde76da42
Status: Image is up to date for php:latest
--> Running step: wercker-init

--> Running step: install phpunit
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed


100   160  100   160    0     0    684      0 --:--:-- --:--:-- --:--:--   686
100 2745k  100 2745k    0     0  3503k      0 --:--:-- --:--:-- --:--:-- 7659k
--> Running step: install composer
All settings correct for using Composer
Downloading...

Composer successfully installed to: /usr/local/bin/composer
Use it: php /usr/local/bin/composer
--> Running step: install dependencies
Loading composer repositories with package information
Installing dependencies (including require-dev) from lock file
Nothing to install or update
Generating autoload files
--> Running step: Serve application
--> Running step: PHPUnit integration tests
PHPUnit 5.2.8 by Sebastian Bergmann and contributors.

[Thu Feb 18 14:42:53 2016] ::1:50160 [200]: /
.                                                                   1 / 1 (100%)

Time: 64 ms, Memory: 8.00Mb

OK (1 test, 2 assertions)
--> Steps passed: 5.83s
--> Pipeline finished: 7.18s
```

Success!

Building locally is very useful when you're not sure your code  will run
because of some changes you made. As such you don't want to push these
changes to your Git provider just yet.

But since we've verified that our app is compiling and running correctly, it's
time to let wercker build & deploy your app in the cloud, which is what we'll
be doing in the next section.

### Adding your app to wercker

The next step is to create a new application on wercker. Head over to
[https://app.wercker.com/](https://app.wercker.com/) and in the menu bar select
_create_ -> _application_.

#### Select your Git Provider

First select your Git provider, after which a list of your existing
repositories on either GitHub or BitBucket is presented. Select the ruby
example you forked earlier from the list and click on **Use selected repo**.

![image](/images/getting_started_select_repo_php.png)

#### Select the owner

Now we have to choose who owns the app. For this tutorial, go ahead and select
yourself. If you like, you can also select an organization you created on
wercker. Click on **Use selected owner** once you're ready.

#### Configure Access

The next step is about configuring access, and the first option - **checkout
the code without using an SSH key** - is fine for the purpose of this tutorial,
because it's an open source and public application.

![image](/images/getting_started_configure_access.png)

#### Finishing up

Finally, once you've verified all the settings you can click **Finish** to
complete setting up our app!  When done, you will be redirected to your very
own app page, which looks empty now, so let's go ahead and change that.

### Triggering your first build

Wercker will automatically trigger a build every time you push new code to your
Git provider. Let's see that in action. In your working directory, run

```
$ git commit -am 'wercker build time!'
$ git push origin master
```

Next, navigate to your app page and you should see a new build has been
triggered! This build will do the exact same as the one you triggered locally
but now everyone in your team can see and comment on the build.

![image](/images/getting_started_wercker_build_php.png)

### Wrapping up

Congratulations! You've built your first app using wercker. The next tutorial
in this series will be about how to deploy your PHP app to a Digital Ocean
server (Coming soon!).
