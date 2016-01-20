## Introduction to pipelines

The pipeline is the heart and soul of wercker, it’s where you define the
actions (steps) and environment for your tasks, often your tests, builds and
deploys. 

They are an aggregate of steps and will pass or fail based on the
[steps](/learn/steps/introduction.html) within. Each pipeline also comes with
an environment, some set by default by the wercker tool and, when run by
wercker.com, others defined by the settings you’ve entered on
[wercker](https://app.wercker.com) itself. Steps are the actions performed
within pipelines.

Currently wercker support three types of pipelines; a **dev**, **build** and a
**deploy** pipeline. Pipelines can be executed locally through the
[CLI](/learn/basics/workflow.html), and on the wercker platform, with the
exception of the **dev** pipeline, which can **only** be executed locally.

![image](/images/pipelines.png)

In the following paragraphs we will describe the elements that make up the
wercker pipeline.

[How it works &rsaquo;](/learn/pipelines/how-it-works.html "nav next pipelines")
