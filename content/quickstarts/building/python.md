## Getting started with wercker & python
This guide is a step-by-step approach to developing, building and deploying a
sample app with wercker within minutes.

While this guide uses Python, the general concepts explained in this tutorial
apply to every other programming language.

### Requirements
To be able to follow along with this guide, you will need the following things:
* [A wercker account](https://app.wercker.com/users/new/)
* [The wercker CLI](http://wercker.com/cli/install)

### Setting up the app
Before we can start developing, we have to fork and clone the [sample
app](https://github.com/wercker/getting-started-python) into our local
development environment. After you've done that, `cd` into the project
directory.

```
$ cd getting-started-python/
```

Next, install the dependencies using pip and finally run the app to verify
everything is working.

```
$ pip install -r requirements.txt
$ python app.py
```

Now in your browser navigate to `127.0.0.1:5000/cities.json` and you should be
presented with the following output:

```
[
"Amsterdam",
"San Francisco",
"Berlin",
"New York"
]
```

### Developing the app
Now that we've setup our app we can start developing. Our list of
cities is a bit short, so why not add another one in there?  Before we do that
however, let's first take a closer look at the **wercker.yml** file included in
your project folder.


### Wercker.yml
The [wercker.yml](/docs/wercker-yml/index.html) is the only config file you
need for using wercker.  In it, you will define all your steps needed to
successfully **develop**, **build** and **deploy** your application.

To get started however, we're only interested in **developing** our app, so
let's take a closer look at this `dev` _pipeline_ right now.


```yaml
# The container definition we want to use for developing our app
box: python:2.7-slim

# in this dev clause we define the steps we want to take when developing.
dev:
  steps:
    # first we want to run pip-install to install all the dependencies
    - pip-install
    # then we want to run a wercker step that watches your files and reloads
    # when changes are detected.
    - internal/watch:
        code: python app.py
        reload: true
```

Let's take a closer look at what's happening.

`box: python:2.7-slim`

This line specifies which container image you want to use for your project.
Since we're developing for Python, we've already specified a python image for
you.  These images are retrieved from
[Docker Hub](https://registry.hub.docker.com/u/library/python/) if no other
registry is specified. Read more about containers
[here](/docs/containers/index.html)

```
dev:
  steps:
    - pip-install
    - internal/watch:
        code: python app.py
        reload:true
```

In the `dev` clause we define what we want to happen in our development
pipeline, which in this case are two steps: `pip-install` and `internal/watch`.
These `steps` are pre-written bash scripts written by either wercker or the
community. You can read more about steps
[here](/docs/steps/index.html).

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
Pulling repository python
Pulling image (2.7-slim) from python: 8320d6315882
Pulling image (2.7-slim) from python, endpoint: https://registry-1.docker.io/v1/: 8320d6315882
Pulling dependent layers: 8320d6315882
Download complete: 41b730702607
Download complete: fc00109c41f7
(...)
Download complete: 8320d6315882
Status: Image is up to date for python:2.7-slim
--> Running step: wercker-init
--> Running step: pip-install
No virtual environment detected. Sudo will be used for pip install
Running pip install with sudo: sudo pip install  -r requirements.txt
Collecting Flask==0.9 (from -r requirements.txt (line 1))
  Downloading Flask-0.9.tar.gz (481kB)
Collecting Werkzeug>=0.7 (from Flask==0.9->-r requirements.txt (line 1))
  Downloading Werkzeug-0.10.4-py2.py3-none-any.whl (293kB)
Collecting Jinja2>=2.4 (from Flask==0.9->-r requirements.txt (line 1))
  Downloading Jinja2-2.7.3.tar.gz (378kB)
Collecting markupsafe (from Jinja2>=2.4->Flask==0.9->-r requirements.txt (line 1))
  Downloading MarkupSafe-0.23.tar.gz
Installing collected packages: Werkzeug, markupsafe, Jinja2, Flask
  Running setup.py install for markupsafe
  Running setup.py install for Jinja2
  Running setup.py install for Flask
Successfully installed Flask-0.9 Jinja2-2.7.3 Werkzeug-0.10.4 markupsafe-0.23
pip install succeeded
--> Running step: watch
--> Reloading on file changes
--> Reloading
--> Forwarding 192.168.59.103:5000 to 5000 on the container.
 * Running on http://0.0.0.0:5000/ (Press CTRL+C to quit)
 * Restarting with stat
```

The IP displayed here could be different for you, as this tutorial was written
using boot2docker. If you navigate to DOCKER_HOST_IP:5000/cities.json you
should see the same output as before. That's not very exciting, so let's see
our live reloading in action.

In **app.py** add a new city to the array

```
@app.route('/cities.json')
def cities():
    data = ['Amsterdam', 'San Francisco', 'Berlin', 'New York', 'Tokyo']
    resp = Response(json.dumps(data), status=200, mimetype='application/json')
    return resp
```

Once you save your changes, the app should automatically reload. If you
refresh your page, our new city should be there! Hurrah!

There are [many more steps](https://app.wercker.com/#explore) to use for
developing your app.  Take a look around, and if you can't find the step you're
looking for, you can always just [make your
own](/docs/steps/creating-steps.html)

Now that we're done developing, we want to push our changes and let wercker
build and deploy our app for us.

### Building your app
Before we continue, Let's revisit our **wercker.yml** again.

```yaml
box: python:2.7-slim
dev:
  steps:
    - pip-install
    - internal/watch:
        code: python app.py
        reload: true
build:
  steps:
    - pip-install
    - script:
        name: python unit test
        code: |
          python app_test.py
```

#### Build Pipeline
We're now interested in what's happening in the _build_ pipeline. Notice that
the `- pip-install` step remains the same, but we've added a new kind of step:
a _script step_. This script step is a piece of inline bash code which we're
using to run our tests.

```
- script:
    name: python unit test
    code: |
      python app_test.py
```

This is a simple inline **bash** script. You can create these steps directly in
your **wercker.yml** or share them with the community by [submitting a step to
our repository](/docs/steps/creating-steps.html).
This script simply runs the unit tests using python.

#### Wercker build
Now that we have a better understanding of our **wercker.yml** let's go ahead
and let wercker **build** our project. In your project folder, run

```
$ wercker build
--> Executing pipeline
--> Running step: setup environment
Pulling repository python
Pulling image (2.7-slim) from python: 8320d6315882
Pulling image (2.7-slim) from python, endpoint: https://registry-1.docker.io/v1/: 8320d6315882
Pulling dependent layers: 8320d6315882
Download complete: 8320d6315882
(...)
Download complete: 8320d6315882
Status: Image is up to date for python:2.7-slim
--> Running step: wercker-init
--> Running step: pip-install
No virtual environment detected. Sudo will be used for pip install
Running pip install with sudo: sudo pip install  -r requirements.txt
Collecting Flask==0.9 (from -r requirements.txt (line 1))
  Downloading Flask-0.9.tar.gz (481kB)
Collecting Werkzeug>=0.7 (from Flask==0.9->-r requirements.txt (line 1))
  Downloading Werkzeug-0.10.4-py2.py3-none-any.whl (293kB)
Collecting Jinja2>=2.4 (from Flask==0.9->-r requirements.txt (line 1))
  Downloading Jinja2-2.7.3.tar.gz (378kB)
Collecting markupsafe (from Jinja2>=2.4->Flask==0.9->-r requirements.txt (line 1))
  Downloading MarkupSafe-0.23.tar.gz
Installing collected packages: Werkzeug, markupsafe, Jinja2, Flask
  Running setup.py install for markupsafe
  Running setup.py install for Jinja2
  Running setup.py install for Flask
Successfully installed Flask-0.9 Jinja2-2.7.3 Werkzeug-0.10.4 markupsafe-0.23
pip install succeeded
--> Running step: python unit test
F
======================================================================
FAIL: test_index (__main__.CitiesTestCase)
----------------------------------------------------------------------
Traceback (most recent call last):
  File "app_test.py", line 12, in test_index
    self.assertEqual(response.data, json.dumps(['Amsterdam', 'San Francisco', 'Berlin', 'New York']))
AssertionError: '["Amsterdam", "San Francisco", "Berlin", "New York", "Tokyo"]' != '["Amsterdam", "San Francisco", "Berlin", "New York"]'

----------------------------------------------------------------------
Ran 1 test in 0.008s

FAILED (failures=1)
--> Step failed: python unit test
--> Pipeline failed
```

It seems like our test is failing because we added a new city that isn't
reflected in the tests.  Go ahead and add our new city to `app_test.py`
and run the `wercker build` again.

```
self.assertEqual(response.data, json.dumps(['Amsterdam', 'San Francisco', 'Berlin', 'New York', 'Tokyo']))
```

It should give you the following output:

```
pip install succeeded
--> Running step: python unit test
.
----------------------------------------------------------------------
Ran 1 test in 0.007s

OK
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
[https://app.wercker.com/](https://app.wercker.com/) and select _create_ ->
_application_.

#### Select your Git Provider
First select your Git provider, after which a list of your existing
repositories on either GitHub or BitBucket is presented. Select the python
example you forked earlier from the list and click on **Use selected repo**.

![image](/images/getting_started_select_repo_python.png)

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

![image](/images/getting_started_wercker_build_python.png)

### Wrapping up
Congratulations! You've built your first app using wercker. The next tutorial
in this series will be about how to deploy your python app to a Digital Ocean
server (Coming soon!).

