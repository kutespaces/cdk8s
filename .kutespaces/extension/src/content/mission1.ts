import { readFileSync } from 'fs';
const YAML = require('yaml');
import watch from 'node-watch';
import * as vscode from 'vscode';
import { getSpaceID } from '../api/defaults';
import { logger } from '../log';
import { completeTask } from '../model/mission-slice';
import { Store } from '../model/store';
import { handleError, showMarkdownPreview, workspacePath } from '../util';
import controller from "./controller";

export const metadata = {
  id: 1,
  description: 'First Steps with CDK8s',
  tasks: [
    {
      id: 'createNamespace',
      completed: false,
      description: "Create the 'hello-world' Namespace",
      docUri: workspacePath('Mission 1', 'README.md').with({ fragment: 'task-1-hello-world-namespace' }),
    },
    {
      id: 'createPod',
      completed: false,
      description: 'Create a Pod',
      docUri: workspacePath('Mission 2', 'README.md').with({ fragment: 'task-2-a-new-pod' }),
    }
  ],
};

const taskHandlers = {
  createNamespace: {
    start: (store: Store) => {
      logger.info('createNamespace task started', { eventName: 'task:start', missionID: 1, taskID: 'createNamespace' });
      const mainTsUri = workspacePath('Mission 1', 'main.ts');
      const outUri = workspacePath('Mission 1', 'dist', 'hello.k8s.yaml');
      vscode.workspace.openTextDocument(mainTsUri)
        .then(
          doc => vscode.window.showTextDocument(doc),
        )
        .then(
          () => vscode.workspace.openTextDocument(outUri)
        )
        .then(
          doc => {
            vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true);
            showMarkdownPreview(workspacePath('Mission 1', 'README.md'));
          },
          err => handleError(err, 'Opening document in text editor'),
        );

        const checkOutput = () => {
          const docs = YAML.parseAllDocuments(readFileSync(outUri.fsPath, 'utf-8'));
          for(const doc of docs) {
            let foundNs = undefined;
            let foundName = undefined;
            try {
              foundNs = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'kind' && i.value.toString() === 'Namespace');
              foundName = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'metadata' && i.value.items[0].value.toString() === 'hello-world');
            } catch(e) {
              console.error(`Error checking output file: ${e}`);
            }
            if(foundNs && foundName) {
              watcher.close();
              store.dispatch(completeTask({ missionID: 1, taskID: 'createNamespace' }));
              logger.info('createNamespace task completed', { eventName: 'task:complete', missionID: 1, taskID: 'createNamespace' });
            }
          }
        };
        const watcher = watch(outUri.fsPath, {}, checkOutput);
        checkOutput();

      vscode.commands.executeCommand('workbench.action.tasks.runTask', 'Build Mission 1');
    },
    tearDown: () => {},
  },
  createPod: {
    start: (store: Store) => {
      logger.info('createPod task started', { eventName: 'task:start', missionID: 1, taskID: 'createPod' });
      const outUri = workspacePath('Mission 1', 'dist', 'hello.k8s.yaml');
      const checkOutput = () => {
        const docs = YAML.parseAllDocuments(readFileSync(outUri.fsPath, 'utf-8'));
        for(const doc of docs) {
          let foundDeploy = undefined;
          let foundName = undefined;
          try {
            foundDeploy = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'kind' && i.value.toString() === 'Pod');
            foundName = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'metadata' && i.value.items.find((i: any) => i.toString() === '{"name":"app-worker"}'));
          } catch(e) {
            console.error(`Error checking output file: ${e}`);
          }
          if(foundDeploy && foundName) {
            watcher.close();
            store.dispatch(completeTask({ missionID: 1, taskID: 'createPod' }));
            logger.info('createPod task completed', { eventName: 'task:complete', missionID: 1, taskID: 'createPod' });
          }
        }
      };
      const watcher = watch(outUri.fsPath, {}, checkOutput);
      checkOutput();
    },
    tearDown: () => {
      vscode.commands.executeCommand('workbench.action.tasks.terminate', 'Build Mission 1');
    }
  }
};

export const mount = (store: Store) => controller(store, metadata, taskHandlers);
