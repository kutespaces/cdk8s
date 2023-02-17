import { readFileSync } from 'fs';
const YAML = require('yaml');
import watch from 'node-watch';
import * as vscode from 'vscode';
import { logger } from '../log';
import { completeTask } from '../model/mission-slice';
import { Store } from '../model/store';
import { closeAllTabs, createFileAndFolderIfNotExists, handleError, showMarkdownPreview, workspacePath } from '../util';
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
      closeAllTabs();
      vscode.workspace.openTextDocument(mainTsUri)
        .then(
          doc => vscode.window.showTextDocument(doc),
        )
        .then(
          () => createFileAndFolderIfNotExists(outUri),
        )
        .then(
          () => vscode.workspace.openTextDocument(outUri),
        )
        .then(
          doc => {
            vscode.window.showTextDocument(doc, vscode.ViewColumn.Beside, true);
            showMarkdownPreview(workspacePath('Mission 1', 'README.md'));
          },
          err => handleError(err, 'Opening document in text editor'),
        );

        const checkOutput = () => {
          logger.debug('Checking hello.k8s.yaml');
          const docs = YAML.parseAllDocuments(readFileSync(outUri.fsPath, 'utf-8'));
          for(const doc of docs) {
            let foundNs = undefined;
            let foundName = undefined;
            try {
              foundNs = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'kind' && i.value.toString() === 'Namespace');
              foundName = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'metadata' && i.value.items[0].value.toString() === 'hello-world');
              logger.debug(`foundNs: ${foundNs}, foundName: ${foundName}`);
            } catch(e) {
              logger.error(e);
            }
            if(foundNs && foundName) {
              watcher.close();
              clearInterval(interval);
              store.dispatch(completeTask({ missionID: 1, taskID: 'createNamespace' }));
              logger.info('createNamespace task completed', { eventName: 'task:complete', missionID: 1, taskID: 'createNamespace' });
            }
          }
        };
        const watcher = watch(outUri.fsPath, {}, () => {
          logger.debug('File watcher for hello.k8s.yaml has triggered');
          checkOutput();
        });
        const interval = setInterval(() => {
          logger.debug('Interval for hello.k8s.yaml has triggered');
          checkOutput();
        }, 5000);

      vscode.commands.executeCommand('workbench.action.tasks.runTask', 'Build Mission 1');
    },
    tearDown: () => {},
  },
  createPod: {
    start: (store: Store) => {
      logger.info('createPod task started', { eventName: 'task:start', missionID: 1, taskID: 'createPod' });
      const outUri = workspacePath('Mission 1', 'dist', 'hello.k8s.yaml');
      const checkOutput = () => {
        logger.debug('Checking hello.k8s.yaml');
        const docs = YAML.parseAllDocuments(readFileSync(outUri.fsPath, 'utf-8'));
        for(const doc of docs) {
          let foundDeploy = undefined;
          let foundName = undefined;
          try {
            foundDeploy = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'kind' && i.value.toString() === 'Pod');
            foundName = doc.contents.items.find((i: {key: string, value: any}) => i.key.toString() === 'metadata' && i.value.items.find((i: any) => i.toString() === '{"name":"app-worker"}'));
            logger.debug(`foundDeploy: ${foundDeploy}, foundName: ${foundName}`);
          } catch(e) {
            logger.error(e);
          }
          if(foundDeploy && foundName) {
            watcher.close();
            clearInterval(interval);
            store.dispatch(completeTask({ missionID: 1, taskID: 'createPod' }));
            logger.info('createPod task completed', { eventName: 'task:complete', missionID: 1, taskID: 'createPod' });
            vscode.commands.executeCommand('kutespaces.completeMission1');
          }
        }
      };
      const watcher = watch(outUri.fsPath, {}, () => {
        logger.debug('File watcher for hello.k8s.yaml has triggered');
        checkOutput();
      });
      const interval = setInterval(() => {
        logger.debug('Interval for hello.k8s.yaml has triggered');
        checkOutput();
      }, 5000);
    },
    tearDown: () => {
      vscode.commands.executeCommand('workbench.action.tasks.terminate', 'Build Mission 1');
      closeAllTabs();
    }
  }
};

export const mount = (store: Store) => controller(store, metadata, taskHandlers);
