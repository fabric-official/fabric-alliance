import * as assert from 'assert';
import * as vscode from 'vscode';

suite('Fabric Extension Test Suite', () => {
    test('Extension activates correctly', async () => {
        const extension = vscode.extensions.getExtension('fabric-alliance.vscode-fab-plugin');
        assert.ok(extension, 'Extension should be present');
        await extension?.activate();
        assert.ok(extension.isActive, 'Extension should activate');
    });
});
