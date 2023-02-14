# Mission 2 – Briefing

In the second mission, you get to see how abstractions make your life as a Kubernetes engineer easier. You use [cdk8s+](https://cdk8s.io/docs/latest/plus/) to define a Kubernetes deployment and ingress.

[cdk8s+](https://cdk8s.io/docs/latest/plus/) is a library with high-level abstractions for authoring Kubernetes applications. Without it, you use *imported, auto-generated* constructs based on the schemas in your Kubernetes API. cdk8s+ constructs are hand-crafted, exposing richer APIs with reduced complexity.

For example, look at the example for defining a deployment below. With cdk8s+, you don't have to worry about labels and selectors: the `kplus.Deployment` construct sets a matching set of labels and selectors for you.

![cdk8s vs cdk8s+ Deployment](https://cdk8s.io/docs/latest/assets/corevsplus.png)

## Task 1: Create the Podinfo Deployment

Your first assignment is to create a deployment for the [podinfo app](https://github.com/stefanprodan/podinfo) in the `podinfo` namespace.

Create a `kplus.Deployment` instance based on the [`stefanprodan/podinfo`](https://hub.docker.com/r/stefanprodan/podinfo) container image. Ensure to expose the listening port `9898`.

A build task has been started automatically. The task watches the [`main.ts` file](main.ts) in the `Mission 2` folder. When this file changes, it automatically updates the synthesized manifests in the `dist` folder and applies them using `kubectl apply`.

Moreover, we have started a `k9s` instance for you to see what's happening in the namespace.

**This task is marked complete when…** you create a valid deployment in the `podinfo` namespace. It must have a name starting with `podinfo-deployment-` – this will be the default prefix.

## Task 2: Expose Podinfo through an Ingress

In the second assignment, you expose *podinfo* through an ingress.

This is most easily done with the `deployment.exposeViaIngress(path)` method. This convenience method creates a service with labels matching the deployment and the ingress resource itself.

**This task is marked complete when…** you create a valid ingress in the `podinfo` namespace. It must have a name starting with `podinfo-`, which is the default prefix.

## Debrief

You can now visit the *podinfo* app. Open the Kutespace inspector and select *🌍 Components* and *Podinfo via Ingress*. Your browser opens and you'll see the podinfo app you just deployed with cdk8s. 🎉

## Troubleshooting

<details>
  <summary>No Build Output Appears</summary>

  * Verify that the *Build Mission 2* task is running (Command: *Tasks: Run Task*).
</details>
