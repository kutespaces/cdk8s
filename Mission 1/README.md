# Mission 1 – Briefing

This mission is based on the [Getting Started Guide of CDK8s](https://cdk8s.io/docs/latest/getting-started/).

The CDK8s supports code written in TypeScript, Python, Java and Go. We will use *TypeScript* here.

To get started, you install the `cdk8s-cli` NPM package and run `cdk8s init` in an empty directory. This has been completed here already.

The most important concepts you need to know are *App*, *Chart* and *Construct*:

* An *App* consists of many *Charts* that make up some deployment. The *App* is at the root of the tree that defines the cdk8s resources.

* A [*Chart*](https://cdk8s.io/docs/latest/basics/chart/) is a container that *synthesizes* many Constructs into a single Kubernetes manifest (one YAML file per Chart)

* A [*Construct*](https://cdk8s.io/docs/latest/basics/constructs/) is the basic building block. On the lowest level, constructs are Kubernetes resources, such as a Namespace. When you create groups of resources that belong together, you create an abstraction. Constructs enable the composition of primitives into higher-level abstractions through object-oriented programming.

## Task 1: `hello-world` Namespace

Let's get started with the first resource.

Uncomment the commented namespace in [`main.ts`](main.ts#L11).

You see the output file [`hello.k8s.yaml`](dist/hello.k8s.yaml) on the right side. When you save the namespace, a YAML manifest for the namespace appears on the right. This is achieved by a build task that watches the TypeScript files and builds YAML manifests when the TypeScript changes.

## Task 2: A New Pod

Now uncomment the remaining code in [`main.ts`](main.ts#L21). The Pod spec contains some custom code for the prefix and it references the namespace as a variable, not by its name.

This is a huge power: you can use programming constructs to [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) up your Kubernetes manifests.

## Debrief

You have now been introduced to the basics of CDK8s, you can add simple constructs, and tie them together with code.

## Troubleshooting

<details>
  <summary>No Build Output Appears</summary>

  * Verify that the *Build Mission 1* task is running (Command: *Tasks: Run Task*).
</details>


