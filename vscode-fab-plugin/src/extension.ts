import * as vscode from 'vscode';
import { exec } from 'child_process';

export function activate(context: vscode.ExtensionContext) {
    console.log('Fabric VSCode Plugin Activated');

    const buildCmd = vscode.commands.registerCommand('fabric.build', () => runFabCommand('fab build'));
    const auditCmd = vscode.commands.registerCommand('fabric.audit', () => runFabCommand('fab audit'));
    const claimCmd = vscode.commands.registerCommand('fabric.claim', () => runFabCommand('fab claim'));

    context.subscriptions.push(buildCmd, auditCmd, claimCmd);
}

function runFabCommand(command: string) {
    const terminal = vscode.window.createTerminal('Fabric CLI');
    terminal.sendText(command);
    terminal.show();
}

export function deactivate() {}

