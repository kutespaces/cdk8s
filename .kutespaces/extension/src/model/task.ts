import * as vscode from 'vscode';
export interface Task {
  id: string;
  completed: boolean;
  description: string;
  docUri?: vscode.Uri;
}
