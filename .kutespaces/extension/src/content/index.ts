import * as vscode from 'vscode';
import { logger } from "../log";
import { Store } from "../model/store";
import { closeAllTabs, createFileAndFolderIfNotExists, execShellCommand, handleError, workspacePath } from "../util";
import { mount as mission1Mount } from './mission1';
import { mount as mission2Mount } from './mission2';

export function mountMissions(store: Store) {
  mission1Mount(store);
  mission2Mount(store);
}

export function runPlayground() {
  logger.info('Run Playground', { eventName: 'playground:run' });
  const NS = 'playground';
  const mainTsUri = workspacePath('Playground', 'main.ts');
  const outUri = workspacePath('Playground', 'dist', 'playground.k8s.yaml');

  const createNamespace = execShellCommand(`kubectl create namespace ${NS} --dry-run=client -o yaml | kubectl apply -f -`);

  closeAllTabs()
    .then(
      () => vscode.workspace.openTextDocument(mainTsUri),
    )
    .then(
      doc => vscode.window.showTextDocument(doc),
    )
    .then(
      () => vscode.window.createTerminal({
        shellPath: 'k9s',
        shellArgs: ['-n', NS, '-c', 'configmap'],
        location: {
          viewColumn: vscode.ViewColumn.Beside,
        },
      }),
    )
    .then(
      () => createFileAndFolderIfNotExists(outUri),
    )
    .then(
      () => vscode.workspace.openTextDocument(outUri),
    )
    .then(
      doc => vscode.window.showTextDocument(doc, vscode.ViewColumn.Two, true),
    )
    .catch(
      err => handleError(err, 'Opening document in text editor'),
    );

  createNamespace
  .then(
    () => vscode.commands.executeCommand('workbench.action.tasks.runTask', 'Build Playground'),
  )
  .catch(err => handleError(err));
}
