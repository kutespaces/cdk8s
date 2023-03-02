// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { ResourcesTreeViewProvider } from './treeViewProviders/resources';
import { MissionTasksTreeViewProvider } from './treeViewProviders/mission-tasks';
import { store } from './model/store';
import { abortMission, completeMission, startNextMission } from './model/mission-slice';
import { showInformationMessage, showMarkdownPreview, workspacePath } from './util';
import { logger } from './log';
import { mountMissions, runPlayground } from './content';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	logger.info('Kutespaces extension started', { eventName: 'extension:activate' });
	mountMissions(store);

	vscode.window.registerTreeDataProvider('kutespacesResources', new ResourcesTreeViewProvider(store));
	vscode.window.registerTreeDataProvider('kutespacesMissionTasks', new MissionTasksTreeViewProvider(store));

	context.subscriptions.push(vscode.commands.registerCommand('kutespaces.revealInspector', () => {
		vscode.commands.executeCommand("kutespacesResources.focus");
	}));

	context.subscriptions.push(vscode.commands.registerCommand('kutespaces.startNextMission', () => {
		store.dispatch(startNextMission());
	}));

	context.subscriptions.push(vscode.commands.registerCommand('kutespaces.abortMission', () => {
		store.dispatch(abortMission());
	}));

	context.subscriptions.push(vscode.commands.registerCommand('kutespaces.completeMission', () => {
		store.dispatch(completeMission());
	}));

	// Open README by default
	const openREADME = () => {
		logger.debug('README opened by command', { eventName: 'extension:open_readme' })
		showMarkdownPreview(workspacePath('README.md'));
	};
	let openREADMECommand = vscode.commands.registerCommand('kutespaces.openREADME', openREADME);
	context.subscriptions.push(openREADMECommand);

	const openTutorial = () => {
		logger.debug('Tutorial opened by command', { eventName: 'extension:open_tutorial' })
		vscode.commands.executeCommand('workbench.action.openWalkthrough', 'Shark.kutespaces#tutorial', false)
	};
	let openTutorialCommand = vscode.commands.registerCommand('kutespaces.openTutorial', openTutorial);
	context.subscriptions.push(openTutorialCommand);
	openTutorial();

	let runPlaygroundCommand = vscode.commands.registerCommand('kutespaces.runPlayground', runPlayground);
	context.subscriptions.push(runPlaygroundCommand);

	showInformationMessage('Head over to the tutorial for getting started with this space.', 'Show Tutorial')
		.then(choice => {
			if(typeof choice !== 'undefined') {
				openTutorial();
			}
		});

	logger.debug('Kutespaces extension activate end');
}

// This method is called when your extension is deactivated
export function deactivate() {}
