import * as vscode from 'vscode';
import { kubeconfig, appsV1Api, networkingV1Api } from '../k8sAPI';
import { completeTask } from '../model/mission-slice';
import { Store } from '../model/store';
import { closeAllTabs, createFileAndFolderIfNotExists, execShellCommand, handleError, showMarkdownPreview, workspacePath } from '../util';
import controller from "../model/mission-controller";
import { Watch, ListWatch } from '@kubernetes/client-node';
import { logger } from '../log';

export const metadata = {
  id: 2,
  description: 'cdk8s+ & Abstractions',
  basePath: workspacePath('Mission 2'),
  tasks: [
    {
      id: 'createDeployment',
      completed: false,
      description: "Create the Podinfo Deployment",
      docUri: workspacePath('Mission 2', 'README.md').with({ fragment: 'task-1-create-the-podinfo-deployment' }),
    },
    {
      id: 'exposePodinfo',
      completed: false,
      description: 'Expose Podinfo through an Ingress',
      docUri: workspacePath('Mission 2', 'README.md').with({ fragment: 'task-2-expose-podinfo-through-an-ingress' }),
    }
  ],
};

const NS = 'podinfo';

const taskHandlers = {
  createDeployment: {
    start: (store: Store) => {
      logger.info('createDeployment task started', { eventName: 'task:start', missionID: 2, taskID: 'createDeployment' });
      const mainTsUri = vscode.Uri.joinPath(metadata.basePath, 'main.ts');
      const outUri = vscode.Uri.joinPath(metadata.basePath, 'dist', 'podinfo.k8s.yaml');
      closeAllTabs();
      vscode.workspace.openTextDocument(mainTsUri)
        .then(
          doc => vscode.window.showTextDocument(doc),
        )
        .then(() => execShellCommand('kubectl create namespace podinfo --dry-run=client -o yaml | kubectl apply -f -'))
        .then(
          () => vscode.window.createTerminal(undefined, 'k9s', ['-n', NS, '-c', 'pod']),
          err => handleError(err, 'Creating namespace')
        )
        .then(
          () => createFileAndFolderIfNotExists(outUri),
        )
        .then(
          () => vscode.workspace.openTextDocument(outUri)
        )
        .then(
          doc => {
            vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true);
            showMarkdownPreview(vscode.Uri.joinPath(metadata.basePath, 'README.md'));
          },
          err => handleError(err, 'Opening document'),
        );

      const kc = kubeconfig();
      const k8sAPI = appsV1Api();

      const path = `/apis/apps/v1/namespaces/${NS}/deployments`;
      const watch = new Watch(kc);
      const listFn = () => k8sAPI.listNamespacedDeployment(NS);

      const cache = new ListWatch(path, watch, listFn);

      const looper = () => {
        logger.debug('Checking deployments');
        const list = cache.list(NS);
        if (list) {
          const names = list.map(i => i.metadata?.name);
          logger.debug(`Found ${names.length} deployments: ${JSON.stringify(names)}`);
          if (typeof names.find(n => n?.startsWith('podinfo-deployment-')) !== 'undefined') {
            store.dispatch(completeTask({ missionID: metadata.id, taskID: 'createDeployment' }));
            logger.info('createDeployment task completed', { eventName: 'task:complete', missionID: 2, taskID: 'createDeployment' });
            return;
          }
        } else {
          logger.debug('Didn\'t receive deployments');
        }
        setTimeout(looper, 2000);
      };

      looper();
      vscode.commands.executeCommand('workbench.action.tasks.runTask', 'Build Mission 2');
    },
    tearDown: () => { },
  },
  exposePodinfo: {
    start: (store: Store) => {
      logger.info('exposePodinfo task started', { eventName: 'task:start', missionID: 2, taskID: 'exposePodinfo' });
      const kc = kubeconfig();
      const k8sAPI = networkingV1Api();

      const path = `/apis/networking.k8s.io/v1/namespaces/${NS}/ingresses`;
      const watch = new Watch(kc);
      const listFn = () => k8sAPI.listNamespacedIngress(NS);

      const cache = new ListWatch(path, watch, listFn);

      const looper = () => {
        logger.debug('Checking ingresses');
        const list = cache.list(NS);
        if (list) {
          const names = list.map(i => i.metadata?.name);
          logger.debug(`Found ${names.length} ingresses: ${JSON.stringify(names)}`);
          if (typeof names.find(n => n?.startsWith('podinfo-')) !== 'undefined') {
            store.dispatch(completeTask({ missionID: metadata.id, taskID: 'exposePodinfo' }));
            logger.info('exposePodinfo task completed', { eventName: 'task:complete', missionID: 2, taskID: 'exposePodinfo' });
            vscode.commands.executeCommand('kutespaces.completeMission2');
            return;
          }
        } else {
          logger.debug('Didn\'t receive ingresses');
        }
        setTimeout(looper, 2000);
      };

      looper();
    },
    tearDown: () => {
      closeAllTabs();
      vscode.commands.executeCommand('workbench.action.tasks.terminate', 'Build Mission 2');
    },
  }
};

export const mount = (store: Store) => controller(store, metadata, taskHandlers);
