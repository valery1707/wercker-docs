## Getting started with wercker & Javascript
This guide is a step-by-step approach to developing, building and deploying a
sample app with wercker within minutes.

While this guide uses javascript, the general concepts explained in this tutorial
apply to every other programming language.

### Requirements
To be able to follow along with this guide, you will need the following things:
* [A wercker account](https://app.wercker.com/users/new/)
* [The wercker CLI](http://wercker.com/cli/install)

### Setting up the app
Before we can start developing, we have to fork and clone the [sample
app](https://github.com/wercker/getting-started-nodejs) into our local development
environment. After you've done that, `cd` into the project directory.

```
$ cd getting-started-nodejs/
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
box: node:4.2.6-slim
# Defining the dev pipeline
dev:
  steps:
    - npm-install
    - internal/watch:
        code: node app.js
        reload: true
```

The first line specifies which container image you want to use for your
project.  Since we're developing with nodejs, we've already specified an
image for you.  These container images are retrieved from [Docker
Hub](https://hub.docker.com/r/nodesource/trusty/) if no other registry is
specified. You can read more about containers
[here](/docs/containers/index.html).

In the `dev` clause we define what we want to happen in our development
pipeline, which in this case consists of two steps: `npm-install` and
`internal/watch`.

These `steps` are pre-written bash scripts written by either wercker or the
community. You can read more about steps [here](/docs/steps/index.html)

`npm-install` is a wercker step that, unsurprisingly, runs `npm-install`.

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
Pulling repository nodesource/trusty
Pulling image (latest) from nodesource/trusty: 1a464bde82b1
Pulling image (latest) from nodesource/trusty, endpoint: https://registry-1.docker.io/v1/: 1a464bde82b1
Pulling dependent layers: 1a464bde82b1
(...)
Pulling fs layer: bfe5eacf5a79
Download complete: bfe5eacf5a79
Pulling metadata: 1a464bde82b1
Pulling fs layer: 1a464bde82b1
Download complete: 1a464bde82b1
Download complete: 1a464bde82b1
Status: Downloaded newer image for nodesource/trusty:latest
--> Running step: wercker-init
--> Running step: npm-install
Starting npm install, try: 1
npm WARN package.json getting-started-nodejs@0.0.1 No repository field.
npm WARN package.json supertest@0.4.0 No repository field.
Finished npm install
--> Running step: watch
--> Reloading on file changes
--> Reloading
--> Forwarding 192.168.59.103:5000 to 5000 on the container.
```

Wercker first checks out your code and then sets up the container environment.
This means that the container will be pulled from Docker Hub and subsequently
started with access to your checked out code. It will then start executing all the
steps that are defined in the **wercker.yml**.

Please note that the IP displayed here could be different for you, as this
tutorial was written using `boot2docker`.

If you navigate to DOCKER_HOST_IP:5000 you should see the same
output as before.  That's not very exciting, so let's see our live reloading in
action. In **app.js** add a new city to the array:

```
app.get('/', function(req, res){
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.write(JSON.stringify({cities : ["San Francisco","Amsterdam", "Berlin", "New York", "Palo Alto", "San Mateo", "Paris"]}));
    res.end();
});
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
box: node:4.2.6-slim
dev:
  steps:
    - npm-install
    - internal/watch:
        code: node app.js
        reload: true

# Build definition
build:
  # The steps that will be executed on build
  steps:
    - script:
        code: export NODE_ENV='testing'
    # A step that executes `npm install` command
    - npm-install
    # A step that executes `npm test` command
    - npm-test

    # A custom script step, name value is used in the UI
    # and the code value contains the command that get executed
    - script:
        name: echo nodejs information
        code: |
          echo "node version $(node -v) running"
          echo "npm version $(npm -v) running"
```

#### Build Pipeline
We're now interested in what's happening the _build_ pipeline, where we've
added a new kind of step: a _script step_. This script step is a piece of
inline bash code which we're using to run our tests. You can create and share
these kind of steps with the community by [submitting a step to our
repository](/docs/steps/creating-steps.html).

#### wercker build
Now that we have a better understanding of our **wercker.yml** let's go ahead
and let wercker **build** our project. In your project folder, first run `rm -r node_modules`, and then `wercker build`:

```
$ wercker build
--> Executing pipeline
--> Running step: setup environment
Pulling repository nodesource/trusty
Pulling image (latest) from nodesource/trusty: 1a464bde82b1
Pulling image (latest) from nodesource/trusty, endpoint: https://registry-1.docker.io/v1/: 1a464bde82b1
Pulling dependent layers: 1a464bde82b1
Download complete: 428b411c28f0
Download complete: bfe5eacf5a79
Download complete: 1a464bde82b1
Download complete: 1a464bde82b1
Status: Image is up to date for nodesource/trusty:latest
--> Running step: wercker-init
--> Running step: script
--> Running step: npm-install
Starting npm install, try: 1
npm WARN package.json getting-started-nodejs@0.0.1 No repository field.
supertest@0.4.0 node_modules/supertest
├── methods@0.0.1
└── superagent@0.9.5 (cookiejar@1.3.0, emitter-component@0.0.5, qs@0.4.2, mime@1.2.5, formidable@1.0.9)

mocha@1.6.0 node_modules/mocha
├── growl@1.5.1
├── commander@0.6.1
├── diff@1.0.2
├── mkdirp@0.3.3
├── debug@2.2.0 (ms@0.7.1)
├── ms@0.3.0
└── jade@0.26.3 (mkdirp@0.3.0)

express@3.21.0 node_modules/express
├── escape-html@1.0.2
├── merge-descriptors@1.0.0
├── cookie@0.1.3
├── utils-merge@1.0.0
├── cookie-signature@1.0.6
├── methods@1.1.1
├── fresh@0.3.0
├── basic-auth@1.0.2
├── range-parser@1.0.2
├── content-type@1.0.1
├── etag@1.7.0
├── vary@1.0.0
├── parseurl@1.3.0
├── content-disposition@0.5.0
├── commander@2.6.0
├── depd@1.0.1
├── debug@2.2.0 (ms@0.7.1)
├── proxy-addr@1.0.8 (forwarded@0.1.0, ipaddr.js@1.0.1)
├── mkdirp@0.5.1 (minimist@0.0.8)
├── send@0.13.0 (destroy@1.0.3, ms@0.7.1, statuses@1.2.1, mime@1.3.4, http-errors@1.3.1, on-finished@2.3.0)
└── connect@2.30.0 (bytes@2.1.0, pause@0.0.1, vhost@3.0.0, on-headers@1.0.0, basic-auth-connect@1.0.0, response-time@2.3.1, method-override@2.3.3, cookie-parser@1.3.5, serve-static@1.10.0, http-errors@1.3.1, connect-timeout@1.6.2, qs@2.4.2, serve-favicon@2.3.0, morgan@1.6.0, finalhandler@0.4.0, multiparty@3.3.2, csurf@1.8.3, express-session@1.11.3, body-parser@1.13.1, errorhandler@1.4.0, serve-index@1.7.0, type-is@1.6.3, compression@1.5.0)

nodeunit@0.7.4 node_modules/nodeunit
└── tap@1.2.0 (opener@1.4.1, foreground-child@1.2.0, supports-color@1.3.1, buffer-equal@0.0.1, deep-equal@1.0.0, signal-exit@2.1.2, mkdirp@0.5.1, readable-stream@1.1.13, tap-mocha-reporter@0.0.14, tap-parser@1.1.6, glob@5.0.10, coveralls@2.11.2, nyc@2.3.0, js-yaml@3.3.1)
Finished npm install
--> Running step: echo nodejs information
node version v0.10.38 running
npm version 1.4.28 running
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

![image](/images/getting_started_select_repo_javascript.png)

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

![image](/images/getting_started_wercker_build_javascript.png)

### Wrapping up
Congratulations! You've built your first app using wercker. The next tutorial
in this series will be about how to deploy your javascript app to a Digital Ocean
server (Coming soon!).
