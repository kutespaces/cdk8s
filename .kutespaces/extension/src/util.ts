import path = require('path');
import fs = require('fs')
import * as vscode from 'vscode';
import { logger } from './log';

export function iconPath(name: string): string {
  return path.join(__filename, '..', '..', 'media', `${name}.svg`);
}

export function workspacePath(...segments: string[]): vscode.Uri {
  if(!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length == 0) {
    throw new Error('Expected VSCode workspace to have at least one folder');
  }
  let workspaceUri: vscode.Uri | undefined;
  for (const folder of vscode.workspace.workspaceFolders) {
    if(typeof workspacePathOrUndefined('.kutespaces', 'meta.yaml') !== 'undefined') {
      workspaceUri = folder.uri;
    }
  };
  if(typeof workspaceUri === 'undefined') {
    throw new Error('Expected to find a workspace folder with a .kutespaces/meta.yaml file');
  }
  return vscode.Uri.joinPath(workspaceUri, ...segments);
}

export function workspacePathOrUndefined(...segments: string[]): vscode.Uri | undefined {
  const pth = workspacePath(...segments);
  return fs.existsSync(pth.fsPath) ? pth : undefined;
}

export function showMarkdownPreview(uri: vscode.Uri): void {
  vscode.commands.executeCommand('vscode.openWith', uri, 'vscode.markdown.preview.editor')
}

export function execShellCommand(cmd: string) {
  const exec = require('child_process').exec;
  return new Promise((resolve, _reject) => {
    exec(cmd, (error: any, stdout: any, stderr: any) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}

export function showInformationMessage<T extends string>(message: string, ...items: T[]) {
  logger.info(`UI info message: ${message}`);
  return vscode.window.showInformationMessage(message, ...items);
}

export function handleError(error: any, context?: string) {
  if(context) {
    logger.error(error, { context });
    vscode.window.showErrorMessage(`${context}: ${error}`);
  } else {
    logger.error(error);
    vscode.window.showErrorMessage(`An error occurred: ${error}`);
  }
}
