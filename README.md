# cdk8s on Kutespaces

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

* This space is pre-configured for **cdk8s with TypeScript**. Don't worry if you want to use another language – the concepts are identical.

* There are **two missions** for you to solve:

  * **Mission 1** is about understanding the concept. You will define your first, simple app consisting of a namespace and a pod.

  * **Mission 2** shows you how cdk8s+ abstractions make your life as a Kubernetes developer easier.

* The **Kutespace inspector** will guide you through.

  Click on the **🧪 Test Tube** icon in the side bar to open it.

  ![Kutespace inspector side bar icon](doc/kutespace-inspector-icon.png)

  Make yourself familiar with the environment and click **Start Next Mission** when you're ready. 🚀

## Resources

* [cdk8s Documentation](https://cdk8s.io/docs/latest/)

* [cdk8s Examples](https://cdk8s.io/docs/latest/examples/)

* [GitHub: cdk8s-team/cdk8s](https://github.com/cdk8s-team/cdk8s)
