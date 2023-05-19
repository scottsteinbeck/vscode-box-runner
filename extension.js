// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// Other activation logic
	startBoxSubprocess();
}

function startBoxSubprocess() {
	const boxProcess = spawn('box');

	// Handle subprocess events
	boxProcess.stdout.on('data', (data) => {
		// Process output from the 'box' subprocess
		console.log(data.toString());
	});

	// Listen for save file event
	vscode.workspace.onDidSaveTextDocument((document) => {
		// Run 'cfformat' command on the 'box' subprocess
		boxProcess.stdin.write(`cfformat ${document.fileName}\n`);
	});

	// Close the subprocess when Visual Studio Code is closed
	vscode.workspace.onDidChangeWorkspaceFolders(() => {
		if (vscode.workspace.workspaceFolders === undefined) {
			boxProcess.kill();
		}
	});
	
	let disposable = vscode.commands.registerCommand('extension.runCFFormat', () => {
		const activeEditor = vscode.window.activeTextEditor;
		if (activeEditor) {
		  const activeDocument = activeEditor.document;
		  const fileName = activeDocument.fileName;
		  const command = `cfformat ${fileName}`;
	  
		  // Send the command to the 'box' subprocess
		  boxProcess.stdin.write(`${command}\n`);
		}
	  });
	  
	  context.subscriptions.push(disposable);
	  
}
	

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
