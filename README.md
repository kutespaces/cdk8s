# cdk8s on Kutespaces

## Feedback

> **Note**
> It's very important for us to know about your experience with Kutespaces. You'll find a link to a feedback form below. It takes less than two minutes to submit and you'd help us a lot! 🤝

<p style="font-size:18pt; text-align: center">
<a href="https://docs.google.com/forms/d/e/1FAIpQLSd_F7UXGDz5UMn4fZMnuKQtl6TPuz0ZGeOy8cF94cA_1YRxKw/viewform" target="_blank"><strong>👉 <strong>Feedback Form</strong> 👈</strong></a>
</p>

## Management Summary

cdk8s is a **software development framework for defining Kubernetes applications and reusable abstractions using familiar programming languages and rich object-oriented APIs**.

It generates YAML manifests for any Kubernetes cluster running anywhere.

![cdk8s illustration](https://cdk8s.io/docs/latest/assets/animation.gif)

It works by defining a tree of constructs using any supported programming language:

* TypeScript
* Python
* Java
* Golang

A cdk8s project starts with an *app*. Within the app, you can define any number of *charts*, each of which is written into (*synthesized*) into a separate Kubernetes manifest file. Charts are composed of any number of reusable *constructs*, which contain *Kubernetes resources* (such as a *Pod*, *Deployment*, etc).

cdk8s apps only *define* Kubernetes applications, they do not apply the resources to the cluster. When a cdk8s app is executed, it synthesizes all charts into YAML manifests its `dist` directory. You can apply the manifests with your preferred method, such as `kubectl apply` or GitOps tools like [Argo CD](https://github.com/argoproj/argo-cd) or [Flux](https://github.com/fluxcd/flux2).

## How To Use This

* The **Kutespace Inspector** is your command center.

  Click on the **Kutespaces Icon** in the side bar to open it.

  ![Kutespaces Inspector Icon](doc/Kutespaces-Inspector.png)

  Make yourself familiar with the environment and click **Start Next Mission** when you're ready. 🚀

* Explore cdk8s yourself at the [**Playground**](Playground/README.md).

* There are **Two Missions** for you to solve:

  * **Mission 1** is about understanding what cdk8s does. You will define your first app in TypeScript and synthesize YAML from it.

  * **Mission 2** shows you how cdk8s+ abstractions make your life as a Kubernetes developer easier.

## Resources

* [cdk8s Documentation](https://cdk8s.io/docs/latest/)

* [cdk8s Examples](https://cdk8s.io/docs/latest/examples/)

* [GitHub: cdk8s-team/cdk8s](https://github.com/cdk8s-team/cdk8s)
