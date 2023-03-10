import fs = require('fs');
const YAML = require('yaml');
import * as vscode from 'vscode';
import { ShowMarkdownPreviewCommand } from './commands/show-markdown-preview';
import { iconPath, workspacePath, workspacePathOrUndefined } from '../util';
import { Store } from '../model/store';

export class ResourcesTreeViewProvider implements vscode.TreeDataProvider<vscode.TreeItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined | void> = new vscode.EventEmitter<vscode.TreeItem | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined | void> = this._onDidChangeTreeData.event;
  refresh(): void {
		this._onDidChangeTreeData.fire();
	}

  private store: Store;

  constructor(store: Store) {
    this.store = store;
    this.store.subscribe(this.refresh.bind(this));
  }

  getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
    return element;
  }
  getChildren(element?: vscode.TreeItem | undefined): vscode.ProviderResult<vscode.TreeItem[]> {
    const meta: MetaYAML | undefined = readMetaYAML();
    if(element === undefined) {
      return [
        new KutespacesResource(),
        new ThingsToDo(),
        new Documentation(),
      ];
    }
    if(element.id === 'thingsToDo') {
      const state = this.store.getState().mission;
      let thingsToDo: vscode.TreeItem[] = [];
      for(const id in state.missions) {
        const mission = state.missions[id];
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

        thingsToDo.push(
          new MissionItem(
            mission.id.toString(),
            `Mission ${mission.id}: ${mission.description}${suffix}`,
            theIconPath,
            workspacePathOrUndefined(`Mission ${mission.id}`, 'README.md'),
          )
        );
      }
      if(typeof meta !== 'undefined' && 'thingsToDo' in meta) {
        const thingsFromMeta = meta.thingsToDo.map(c => {
          if(c.action === 'runPlayground') {
            return new Resource(c.label, new RunPlaygroundCommand(c.label));
          }
          return new Resource(c.label, new ShowMarkdownPreviewCommand(c.label, workspacePath(...c.path)))
        });
        thingsToDo = thingsToDo.concat(...thingsFromMeta);
      }
      return thingsToDo;
    }
    if(element.id === 'documentation') {
      if(typeof meta === 'undefined') {
        return [];
      }
      return meta.docs.map(c => new Resource(c.label, new OpenURLCommand(c.label, c.url)));
    }
    if(element.id === 'kutespacesResource') {
      let resources: Resource[] = [];

      const readmeUri = workspacePath('README.md');
      resources.push(new Resource('README', new ShowMarkdownPreviewCommand('README', readmeUri)));

      resources.push(new Resource('Tutorial', new OpenWalkthroughCommand('Tutorial', 'Shark.kutespaces#tutorial', false)));

      return resources;
    }
    return [];
  }
}

export class ThingsToDo extends vscode.TreeItem {
  constructor() {
    super('Things To Do', vscode.TreeItemCollapsibleState.Expanded);
  }

  id = 'thingsToDo';

  iconPath = {
    light: iconPath('test-tube-light'),
    dark: iconPath('test-tube-dark'),
  };
}

export class Documentation extends vscode.TreeItem {
  constructor() {
    super('Documentation', vscode.TreeItemCollapsibleState.Expanded);
  }

  id = 'documentation';

  iconPath = {
    light: iconPath('school-outline-light'),
    dark: iconPath('school-outline-dark'),
  };
}

export class KutespacesResource extends vscode.TreeItem {
  constructor() {
    super('Kutespaces', vscode.TreeItemCollapsibleState.Expanded);
  }

  id = 'kutespacesResource';

  iconPath = {
    light: iconPath('file-document-outline-light'),
    dark: iconPath('file-document-outline-dark'),
  };
}

export class Resource extends vscode.TreeItem {
  constructor(name: string, command: vscode.Command) {
    super(name, vscode.TreeItemCollapsibleState.None);
    this.command = command;
    this.id = `resource-${name}`;
  }

  iconPath = {
    light: iconPath('chevron-right-light'),
    dark: iconPath('chevron-right-dark'),
  };
}

export class OpenWalkthroughCommand implements vscode.Command {
  title: string;
  command: string;
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(title: string, name: string, sideBySide: Boolean) {
    this.title = title;
    this.command = 'workbench.action.openWalkthrough';
    this.arguments = [
      name,
      sideBySide,
    ];
  }
}

export class OpenURLCommand implements vscode.Command {
  title: string;
  command: string;
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(title: string, url: string) {
    this.title = title;
    this.command = 'vscode.open';
    this.arguments = [url];
  }
}

export class RunPlaygroundCommand implements vscode.Command {
  title: string;
  command: string;
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(title: string) {
    this.title = title;
    this.command = 'kutespaces.runPlayground';
  }
}

interface MetaYAML {
  thingsToDo: WorkspaceRef[],
  docs: MetaRef[],
}

interface MetaRef {
  label: string,
  url: string
}

interface WorkspaceRef {
  label: string,
  path: string[],
  action?: string,
}

function readMetaYAML(): MetaYAML | undefined {
  const uri = workspacePathOrUndefined('.kutespaces', 'meta.yaml');
  if (typeof uri === 'undefined') {
    return undefined;
  }
  const contents = fs.readFileSync(uri.fsPath, 'utf8');
  const parsed = YAML.parse(contents);
  return parsed;
}

export class MissionItem extends vscode.TreeItem {
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
  collapsibleState = vscode.TreeItemCollapsibleState.None;
}
