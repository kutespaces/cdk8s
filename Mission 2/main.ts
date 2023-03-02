import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import * as kplus from 'cdk8s-plus-25';
export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = {}) {
    super(scope, id, props);

    const metaDefaults = {
      namespace: 'podinfo',
      labels: {
        'app.kubernetes.io/name': 'podinfo'
      }
    };

    // Namespace
    const ns = new kplus.Namespace(this, 'ns', {
      metadata: {
        name: metaDefaults.namespace,
      }
    });

    // 1. Create the Podinfo Deployment

    // const deployment = new kplus.Deployment(this, 'deployment', {
    //   metadata: metaDefaults,
    //   podMetadata: metaDefaults,
    //   containers: [{
    //     image: 'stefanprodan/podinfo',
    //     portNumber: 9898,
    //   }],
    //   replicas: 1,
    // });

    // 2. Expose Podinfo through an Ingress

    // const _ingress = deployment.exposeViaIngress('/');

    // When you've created the Deployment and Ingress, head over to the Ports panel.
    // Open the 'Traefik Ingress' port to check out podinfo.

    // Troubleshooting: If you can't find the Ports panel, press CMD+Shift+p.
    //                  Type 'Ports: Focus on Ports View'.
  }
}

const app = new App();
new MyChart(app, 'podinfo');
app.synth();
