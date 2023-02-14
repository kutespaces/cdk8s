import * as vscode from 'vscode';
import { Store } from '../model/store';
import { iconPath } from '../util';
import { ShowMarkdownPreviewCommand } from './commands/show-markdown-preview';

export class MissionTasksTreeViewProvider implements vscode.TreeDataProvider<MissionItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<MissionItem | undefined | void> = new vscode.EventEmitter<MissionItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<MissionItem | undefined | void> = this._onDidChangeTreeData.event;

  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.store.subscribe(this.refresh.bind(this));
  }

  refresh(): void {
		this._onDidChangeTreeData.fire();
	}

  getTreeItem(element: MissionItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: MissionItem | undefined): vscode.ProviderResult<MissionItem[]> {
    // Tree is without children
    if(typeof element !== 'undefined') {
      return [];
    }

    const state = this.store.getState().mission;
    const mission = state.currentMission;
    if(typeof mission === 'undefined') {
      return [];
    }
    return state.missions[mission].tasks.map(task => {
      if(task.completed) {
        return new CompletedTaskItem(task.id, task.description, task.docUri);
      }
      return new PendingTaskItem(task.id, task.description, task.docUri);
    });
  }
}

interface MissionItem {
  type: string;
  id: string;
}

export class PendingTaskItem extends vscode.TreeItem {
  constructor(id: string, name: string, docUri: vscode.Uri | undefined) {
    super(name, vscode.TreeItemCollapsibleState.None);
    this.id = id;
    if(typeof docUri !== 'undefined') {
      this.command = new ShowMarkdownPreviewCommand(name, docUri);
    }
  }

  id: string;
  type: string = "goal";

  iconPath = {
    light: iconPath('checkbox-unchecked-light'),
    dark: iconPath('checkbox-unchecked-dark'),
  };
}

export class CompletedTaskItem extends vscode.TreeItem {
  constructor(id: string, name: string, docUri: vscode.Uri | undefined) {
    super(name, vscode.TreeItemCollapsibleState.None);
    this.id = id;
    if(typeof docUri !== 'undefined') {
      this.command = new ShowMarkdownPreviewCommand(name, docUri);
    }
  }

  id: string;
  type: string = "goal"

  iconPath = {
    light: iconPath('checkbox-checked-light'),
    dark: iconPath('checkbox-checked-dark'),
  };
}
