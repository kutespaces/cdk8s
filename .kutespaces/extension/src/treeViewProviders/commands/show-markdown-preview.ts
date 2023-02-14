import * as vscode from 'vscode';

export class ShowMarkdownPreviewCommand implements vscode.Command {
  title: string;
  command: string;
  tooltip?: string | undefined;
  arguments?: any[] | undefined;

  constructor(title: string, uri: vscode.Uri) {
    this.title = title;
    this.command = 'vscode.openWith';
    this.arguments = [
      uri,
      'vscode.markdown.preview.editor',
    ];
  }
}
