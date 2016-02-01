## Getting started with wercker & ruby
This guide is a step-by-step approach to developing, building and deploying a
sample app with wercker within minutes.

While this guide uses Ruby, the general concepts explained in this tutorial
apply to every other programming language.

### Requirements
To be able to follow along with this guide, you will need the following things:
* [A wercker account](https://app.wercker.com/users/new/)
* [The wercker CLI](http://wercker.com/cli/install)

### Setting up the app
Before we can start developing, we have to fork and clone the [sample
app](https://github.com/wercker/getting-started-ruby) into our local development
environment. After you've done that, `cd` into the project directory.

```
$ cd getting-started-ruby/
```

Next, install the dependencies using `bundle install` and run the app to verify
everything is working.

```
$ bundle install
$ bundle exec thin -R config.ru -p 8080 start
```

Now in your browser navigate to `127.0.0.1:8080/cities.json` and you should be
presented with the following json:

```
[
"Amsterdam",
"San Francisco",
"Berlin",
"New York",
"Tokyo",
"London",
"Palo Alto"
]
```

### Developing the app
Now that we've setup our app we can start developing. Our list of cities is a
bit short, so why not add another one in there?  Before we do that however,
let's first take a closer look at the **wercker.yml** file included in your
project folder.

### wercker.yml
The [wercker.yml](/docs/wercker-yml/index.html) is the only config file you
need for using wercker.  In it, you will define all your steps needed to
successfully **develop**, **build** and **deploy** your application.

To get started however, we're only interested in **developing** our app, so
let's take a closer look at this `dev` _pipeline_ right now.

#### Dev pipeline

```yaml
# The container definition we want to use for developing our app
box: phusion/passenger-ruby22
# Defining the dev pipeline
dev:
  steps:
    # first we want to install the dependencies
    - bundle-install
        # then we want to run a wercker step that watches your files and reloads
        # when changes are detected
    - internal/watch:
        code: |
          bundle exec thin -R config.ru -p 8080 start
        reload: true
```

The first line specifies which container image you want to use for your
project.  Since we're developing with Ruby, we've already specified a ruby
image for you.  These container images are retrieved from [Docker
Hub](https://registry.hub.docker.com/u/library/python/) if no other registry is
specified. You can read more about containers
[here](/docs/containers/index.html).

```yaml
dev:
  steps:
    # first we want to install the dependencies
    - bundle-install
        # then we want to run a wercker step that watches your files and reloads
        # when changes are detected
    - internal/watch:
        code: |
          bundle exec thin -R config.ru -p 8080 start
        reload: true
```

In the `dev` clause we define what we want to happen in our development
pipeline, which in this case are two steps: `bundle-install` and `internal/watch`.
These `steps` are pre-written bash scripts written by either wercker or the
community. You can read more about steps
[here](/docs/steps/index.html)

`internal/watch` watches your files for changes, and if `reload` is set to
`true` it restarts your app so your changes are reflected immediately. This is
especially useful for when you're developing webapps, as we're doing now.

Let's see these steps in action now and fire up our _dev pipeline_.

### wercker dev

In your project folder, run `wercker dev --publish 8080`. You should see
something similar to the following output:

```
--> Executing pipeline
--> Running step: setup environment
Pulling repository phusion/passenger-ruby22
Pulling image (latest) from phusion/passenger-ruby22: 67a2efdde29b
Pulling image (latest) from phusion/passenger-ruby22, endpoint: https://registry-1.docker.io/v1/: 67a2efdde29b
Pulling dependent layers: 67a2efdde29b
Download complete: 511136ea3c5a
Pulling metadata: e7a4e82b4b32
Pulling fs layer: e7a4e82b4b32
Download complete: e7a4e82b4b32
Pulling metadata: 67a2efdde29b
Pulling fs layer: 67a2efdde29b
(...)
Download complete: 67a2efdde29b
Download complete: 67a2efdde29b
Status: Downloaded newer image for phusion/passenger-ruby22:latest
--> Running step: wercker-init
--> Running step: bundle-install
Gemfile found. Start bundle install.
bundler gem is available, and will not be installed by this step
type bundle: bundle is /usr/local/bin/bundle
bundle version: Bundler version 1.7.12
bundle install --path /cache/bundle-install/
Don't run Bundler as root. Bundler can ask for sudo if it is needed, and
installing your bundle as root will break this application for all non-root
users on this machine.
Fetching gem metadata from http://rubygems.org/.........
Using rake 10.4.2
Installing daemons 1.2.2
Installing diff-lcs 1.2.5
Installing eventmachine 1.0.7
Installing json 1.8.3
Installing rack 1.6.4
Installing rack-protection 1.5.3
Installing rack-test 0.6.3
Installing rspec-support 3.3.0
Installing rspec-core 3.3.1
Installing rspec-expectations 3.3.0
Installing rspec-mocks 3.3.0
Installing rspec 3.3.0
Installing tilt 2.0.1
Installing sinatra 1.4.6
Installing thin 1.6.3
Using bundler 1.7.12
Your bundle is complete!
It was installed into /cache/bundle-install
finished bundle install --path /cache/bundle-install/
skipping rbenv rehash because rbenv is not found
--> Running step: watch
--> Reloading on file changes
--> Reloading
```

Wercker first checks out your code and then sets up the container environment.
This means that the container will be pulled from Docker Hub and subsequently
started with access to your checked out code. It will then start executing all the
steps that are defined in the **wercker.yml**.

Please not that the IP displayed here could be different for you, as this
tutorial was written using boot2docker.

If you navigate to DOCKER_HOST_IP:8080/cities.json you should see the same
output as before.  That's not very exciting, so let's see our live reloading in
action. In **main.rb** add a new city to the array:

```ruby
get '/' do
      content_type :json
        return {:cities=> ["Amsterdam", "San Francisco", "Berlin",
                           "New York", "Tokyo", "London", "Palo Alto", "Paris"]}.to_json
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
Before we continue, let's revisit our **wercker.yml** again.

```yaml
# The container definition we want to use for developing our app
box: phusion/passenger-ruby22
# Defining the dev pipeline
dev:
  steps:
    # first we want to install the dependencies
    - bundle-install
        # then we want to run a wercker step that watches your files and reloads
        # when changes are detected
    - internal/watch:
        code: |
          bundle exec thin -R config.ru -p 8080 start
        reload: true
build:
  steps:
    - bundle-install
    - script:
        name: rspec
        code: bundle exec rspec
```

#### Build Pipeline
We're now interested in what's happening the _build_ pipeline.  Notice that the
`bundle-install` step remains the same, but we've added a new kind of step: a
_script step_. This script step is a piece of inline bash code which we're
using to run our tests with rspec. You can create and share these kind of steps
with the community by [submitting a step to our
repository](/docs/steps/creating-steps.html).

#### wercker build
Now that we have a better understanding of our **wercker.yml** let's go ahead
and let wercker **build** our project. In your project folder, run:

```
$ wercker build
--> Executing pipeline
--> Running step: setup environment
Pulling repository phusion/passenger-ruby22
Pulling image (latest) from phusion/passenger-ruby22: 67a2efdde29b
Pulling image (latest) from phusion/passenger-ruby22, endpoint: https://registry-1.docker.io/v1/: 67a2efdde29b
Pulling dependent layers: 67a2efdde29b
Download complete: 511136ea3c5a
Download complete: 53f858aaaf03
Status: Image is up to date for phusion/passenger-ruby22:latest
--> Running step: wercker-init
--> Running step: bundle-install
Gemfile found. Start bundle install.
bundler gem is available, and will not be installed by this step
type bundle: bundle is /usr/local/bin/bundle
bundle version: Bundler version 1.7.12
bundle install --path /cache/bundle-install/
Don't run Bundler as root. Bundler can ask for sudo if it is needed, and
installing your bundle as root will break this application for all non-root
users on this machine.
Fetching gem metadata from http://rubygems.org/.........
Using rake 10.4.2
Installing daemons 1.2.2
Installing diff-lcs 1.2.5
Installing eventmachine 1.0.7
Installing json 1.8.3
Installing rack 1.6.4
Installing rack-protection 1.5.3
Installing rack-test 0.6.3
Installing rspec-support 3.3.0
Installing rspec-core 3.3.1
Installing rspec-expectations 3.3.0
Installing rspec-mocks 3.3.0
Installing rspec 3.3.0
Installing tilt 2.0.1
Installing sinatra 1.4.6
Installing thin 1.6.3
Using bundler 1.7.12
Your bundle is complete!
It was installed into /cache/bundle-install
finished bundle install --path /cache/bundle-install/
skipping rbenv rehash because rbenv is not found
--> Running step: rspec
.

1 deprecation warning total

Finished in 0.02283 seconds (files took 0.12789 seconds to load)
1 example, 0 failures


Deprecation Warnings:

Using `should` from rspec-expectations' old `:should` syntax without explicitly enabling the syntax is deprecated. Use the new `:expect` syntax or explicitly enable `:should` with `config.expect_with(:rspec) { |c| c.syntax = :should }` instead. Called from /pipeline/source/spec/main_spec.rb:6:in `block (2 levels) in <top (required)>'.


If you need more of the back-trace for any of these deprecations to
identify where to make the necessary changes, you can configure
`config.raise_errors_for_deprecations!`, and it will turn the
deprecation warnings into errors, giving you the full back-trace.
--> Steps passed
--> Pipeline finished
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

![image](/images/getting_started_select_repo_ruby.png)

#### Select the owner
Now we have to choose who owns the app. For this tutorial, go ahead and select
yourself. If you like, you can also select an organization you created on
wercker. Click on **Use selected owner** once you're ready.

#### Configure Access
The next step is about configuring access, and the first option - **checkout
the code without using an SSH key** - is fine for the purpose of this tutorial,
because it's an open source and public application. So go ahead and click
**Next step**

![image](/images/getting_started_configure_access.png)

#### Configuring the wercker.yml
At this point wercker will try to detect if you have a **wercker.yml** file in
your repository and if not, try to make one for you. However, we already have a
**wercker.yml** file so let's change that and click **I already have a
wercker.yml**. Be sure to leave the **Docker enabled** as it is.

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

![image](/images/getting_started_wercker_build_ruby.png)

### Wrapping up
Congratulations! You've built your first app using wercker. The next tutorial
in this series will be about how to deploy your app to a Digital Ocean
server (Coming soon!).
