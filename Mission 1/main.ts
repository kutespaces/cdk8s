import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { KubeNamespace, ObjectMeta, KubePod } from './imports/k8s';
export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // define resources here

    // const ns = new KubeNamespace(this, 'helloWorld', {
    //   metadata: {
    //     name: 'hello-world',
    //   }
    // });

    // const prefix = 'app';
    // const meta: ObjectMeta = {
    //   namespace: ns.name,
    //   labels: {
    //     app: 'worker'
    //   }
    // };

    // new KubePod(this, 'worker', {
    //   metadata: {
    //     name: `${prefix}-worker`,
    //     ...meta,
    //   },
    //   spec: {
    //     containers: [
    //       {
    //         name: 'wait',
    //         image: 'busybox',
    //         args: ['/bin/sleep', 'infinity']
    //       }
    //     ]
    //   }
    // });
  }
}

const app = new App();
new MyChart(app, 'hello');
app.synth();
