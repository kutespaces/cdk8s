import { Construct } from 'constructs';
import { App, Chart, ChartProps } from 'cdk8s';
import { KubeConfigMap, KubeNamespace } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, id: string, props: ChartProps = { }) {
    super(scope, id, props);

    // Define Resources below.
    // The "Build Playground" task will automatically build this
    // cdk8s project once you save this file.
    // Execute "Tasks: Show Running Tasks" to see the build output (CMD + Shift + P).

    // Keep the namespace – otherwise, kubectl apply --prune will delete it 🥲
    const ns = new KubeNamespace(this, 'playground', {
      metadata: {
        name: 'playground',
      }
    });

    const cfg = new KubeConfigMap(
      this,
      'helloWorld',
      {
        metadata: {
          namespace: ns.name,
        },
        data: {
          niceTo: 'seeYou',
          reply: 'niceToSeeYouToo'
        }
      }
    )
  }
}

const app = new App();
new MyChart(app, 'playground');
app.synth();
