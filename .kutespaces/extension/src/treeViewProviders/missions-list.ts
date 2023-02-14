import * as vscode from 'vscode';
import { TreeItemCollapsibleState } from 'vscode';
import { Store } from '../model/store';
import { ShowMarkdownPreviewCommand } from './commands/show-markdown-preview';
import { iconPath, workspacePathOrUndefined } from '../util';

export class MissionsListTreeViewProvider implements vscode.TreeDataProvider<TreeViewItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<TreeViewItem | undefined | void> = new vscode.EventEmitter<TreeViewItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<TreeViewItem | undefined | void> = this._onDidChangeTreeData.event;

  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.store.subscribe(this.refresh.bind(this));
  }

  refresh(): void {
		this._onDidChangeTreeData.fire();
	}

  getTreeItem(element: TreeViewItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: TreeViewItem | undefined): vscode.ProviderResult<TreeViewItem[]> {
    if(element === undefined) {
      const state = this.store.getState().mission;
      const missionItems = [];
      for(const id in state.missions) {
        const mission = state.missions[id]
        const tags = [];
        let theIconPath = {
          light: iconPath('chevron-right-light'),
          dark: iconPath('chevron-right-dark'),
        };
        if(mission.id === state.currentMission) {
          tags.push('Current Mission');
          theIconPath = {
            light: iconPath('timer-sand-light'),
            dark: iconPath('timer-sand-dark'),
          };
        }
        if(typeof mission.tasks.find(t => !t.completed) === 'undefined') {
          tags.push('Completed');
          theIconPath = {
            light: iconPath('flag-checkered-light'),
            dark: iconPath('flag-checkered-dark'),
          };
        }
        let suffix = '';
        if(tags.length > 0) {
          suffix = ` (${tags.join(', ')})`
        }

        missionItems.push(
          new MissionItem(
            mission.id.toString(),
            `${mission.description}${suffix}`,
            theIconPath,
            workspacePathOrUndefined(`Mission ${mission.id}`, 'README.md'),
          )
        );
      }
      return missionItems;
    }
    return [];
  }
}

interface TreeViewItem {
  type: string;
  id: string;
  collapsibleState: TreeItemCollapsibleState;
}

export class MissionItem extends vscode.TreeItem implements TreeViewItem {
  constructor(id: string, name: string, iconPath: { light: string, dark: string }, markdownUri: vscode.Uri | undefined) {
    super(name, vscode.TreeItemCollapsibleState.Expanded)
    this.id = id;
    this.iconPath = iconPath;
    if(typeof markdownUri !== 'undefined') {
      this.command = new ShowMarkdownPreviewCommand(name, markdownUri);
    }
  }

  id: string;
  type: string = "mission"
  collapsibleState = TreeItemCollapsibleState.None;
}
