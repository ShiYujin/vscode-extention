// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "gogit" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.gogit', () => {
		// vscode.window.showInformationMessage('Go Git!');
		const config = vscode.workspace.getConfiguration('gogit');
		const uri = config.get<vscode.Uri>('url')
		if(uri != undefined){
			let uri_string = uri.toString()
			let texteditor = vscode.window.activeTextEditor
			if(texteditor != undefined){
				// get active doc path
				let doc = texteditor.document.uri
				// vscode.window.showInformationMessage(doc.toString());
				let filepath = doc.fsPath.toString()
				let workspacepath = ""
				let relativepath = ""
				if(vscode.workspace.workspaceFolders != undefined)
					workspacepath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()
				if(filepath.indexOf(workspacepath) >= 0)
					relativepath = filepath.substr(workspacepath.length + 1)
				// vscode.window.showInformationMessage(relativepath);
				if(relativepath != ""){
					uri_string = uri_string + "/tree/master/" + relativepath
					// get cursur
					if(vscode.workspace.workspaceFolders != undefined)
						vscode.window.showInformationMessage(vscode.workspace.workspaceFolders[0].uri.fsPath.toString());
					else vscode.window.showInformationMessage("empty")
					let start = texteditor.selection.start.line + 1
					let end = texteditor.selection.end.line + 1
					if(texteditor.selection.end.character === 0)
						end = end - 1
					// vscode.window.showInformationMessage("start: " + start.toString());
					// vscode.window.showInformationMessage("end: " + end.toString());
					if(start == end){
						uri_string = uri_string + "#L" + start.toString()
					}else{
						uri_string = uri_string + "#L" + start.toString()
							+ "-L" + end.toString()
					}
				}
			}
			vscode.env.openExternal(vscode.Uri.parse(uri_string));
			vscode.window.showInformationMessage(uri_string);
		}
		else
			vscode.window.showInformationMessage('Please edit your repo url in setting!');

	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
