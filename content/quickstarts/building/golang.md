## Getting started with wercker & Go
This guide is a step-by-step approach to developing, building and deploying a
sample app with wercker within minutes.

While this guide uses Go, the general concepts explained in this tutorial
apply to every other programming language.

### Requirements
To be able to follow along with this guide, you will need the following things:
* [A wercker account](https://app.wercker.com/users/new/)
* [The wercker CLI](http://wercker.com/cli/installl)

### Setting up the app
Before we can start developing, we have to fork and clone the [sample
app](https://github.com/wercker/getting-started-golang) into our local development
environment. After you've done that, `cd` into the project directory.

```
$ cd getting-started-golang/
```

Next, build and run the app to verify everything is working.

```
$ go build
$ ./getting-started-golang
```

Now in your browser navigate to `127.0.0.1:5000/cities.json` and you should be
presented with the following json:

```
"{'cities':'San Francisco, Amsterdam, Berlin, New York, Tokyo'}"
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
box: golang
# Defining the dev pipeline
dev:
  steps:
    - internal/watch:
        code: |
          go build ./...
          ./source
        reload: true
```

The first line specifies which container image you want to use for your
project.  Since we're developing with Go, we've already specified a Go
image for you.  These container images are retrieved from [Docker
Hub](https://hub.docker.com/r/library/golang/) if no other registry is
specified. You can read more about containers
[here](/docs/containers/index.html).

In the `dev` clause we define what we want to happen in our development
pipeline, which in this case is just one step: `internal/watch`.

`internal/watch` watches your files for changes, and if `reload` is set to
`true` it restarts your app so your changes are reflected immediately. This is
especially useful for when you're developing webapps, as we're doing now.

Let's see these steps in action now and fire up our _dev pipeline_.

### wercker dev

In your project folder, run `wercker dev --publish 5000`. You should see
something similar to the following output:

```
--> Executing pipeline
--> Running step: setup environment
Pulling repository golang
Pulling image (latest) from golang: ebd45caf377c
Pulling image (latest) from golang, endpoint: https://registry-1.docker.io/v1/: ebd45caf377c
Pulling dependent layers: ebd45caf377c
Download complete: 64e5325c0d9d
Download complete: bf84c1d84a8f
Download complete: 87de57de6955
Download complete: 6a974bea7c0d
Download complete: 3d0d66dec985
Download complete: ec367bd67c88
Download complete: 2d87eca0ec9c
Download complete: ac13965af848
Download complete: 14182e587f2c
Download complete: 37e56f6d02a4
Download complete: 1c18d4d04737
Download complete: 66bf953cd51b
Download complete: 0dfa22e2b56d
Download complete: ebd45caf377c
Download complete: ebd45caf377c
Status: Image is up to date for golang:latest
--> Running step: wercker-init
--> Running step: watch
--> Reloading on file changes
--> Reloading

```

Wercker first checks out your code and then sets up the container environment.
This means that the container will be pulled from Docker Hub and subsequently
started with access to your checked out code. It will then start executing all the
steps that are defined in the **wercker.yml**.

Please note that the IP displayed here could be different for you, as this
tutorial was written using `boot2docker`.

If you navigate to DOCKER_HOST_IP:5000/cities.json you should see the same
output as before.  That's not very exciting, so let's see our live reloading in
action. In **main.go** add a new city to the array:

```
func CityHandler(res http.ResponseWriter, req *http.Request) {
  data, _ := json.Marshal("{'cities':'San Francisco, Amsterdam, Berlin, New York, Tokyo'}")
  res.Header().Set("Content-Type", "application/json; charset=utf-8")
  res.Write(data)
}
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
# The container definition we want to use for developing our app
box: golang
# Defining the dev pipeline
dev:
  steps:
    - internal/watch:
        code: |
          go build ./...
          ./source
        reload: true
build:
  steps:
    - wercker/golint
    - script:
        name: go build
        code: |
          go build ./...
    - script:
        name: go test
        code: |
          go test ./...

```

#### Build Pipeline
We're now interested in what's happening the _build_ pipeline.  We've
added several new steps, to begin with the `wercker/golint` step. This step
checks our code and fails if it thinks we're not doing a good job.  We've also
added a new kind of step: a _script step_. This script step is a piece of
inline bash code which we're using to run our tests. You can create and share
these kind of steps with the community by [submitting a step to our
repository](/docs/steps/creating-steps.html). The rest of the steps should be
self-explanatory: one for building and for testing.

#### wercker build
Now that we have a better understanding of our **wercker.yml** let's go ahead
and let wercker **build** our project. In your project folder, run:

```
$ wercker build
--> Executing pipeline
--> Running step: setup environment
Pulling repository golang
Pulling image (latest) from golang: ebd45caf377c
Pulling image (latest) from golang, endpoint: https://registry-1.docker.io/v1/: ebd45caf377c
Pulling dependent layers: ebd45caf377c
Download complete: 64e5325c0d9d
Download complete: bf84c1d84a8f
Download complete: 87de57de6955
Download complete: 6a974bea7c0d
Download complete: 3d0d66dec985
Download complete: ec367bd67c88
Download complete: 2d87eca0ec9c
Download complete: ac13965af848
Download complete: 14182e587f2c
Download complete: 37e56f6d02a4
Download complete: 1c18d4d04737
Download complete: 66bf953cd51b
Download complete: 0dfa22e2b56d
Download complete: ebd45caf377c
Download complete: ebd45caf377c
Status: Image is up to date for golang:latest
--> Running step: wercker-init
--> Running step: golint
main.go:9:1: exported function CityHandler should have comment or be unexported
--> Running step: go build
--> Running step: go test
ok  	_/pipeline/source	0.006s
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

![image](/images/getting_started_select_repo_golang.png)

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

![image](/images/getting_started_wercker_build_golang.png)

### Wrapping up
Congratulations! You've built your first app using wercker. The next tutorial
in this series will be about how to deploy your Go app to a Digital Ocean
server (Coming soon!).
