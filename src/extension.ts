import * as vscode from 'vscode';

function getbranch() : string{
	var exec = require('child_process').exec;

	let branch = "master"
	let workspacepath = ""
	if(vscode.workspace.workspaceFolders != undefined){
		workspacepath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()

		exec("cd " + workspacepath + "&& git branch --show-current", function(err:Error, stdout:string, stderr:string) {
			branch = stdout
		});
	}
	return branch;
}

function get_uri(branch:string){
	const config = vscode.workspace.getConfiguration('gogit');
	const uri = config.get<vscode.Uri>('url')
	let uri_string = ""
	if(uri != undefined){
		uri_string = "https://" + uri.toString()
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
				uri_string = uri_string + "/tree/" + branch + "/" + relativepath
				// get cursur
				// if(vscode.workspace.workspaceFolders != undefined)
				// 	vscode.window.showInformationMessage(vscode.workspace.workspaceFolders[0].uri.fsPath.toString());
				// else vscode.window.showInformationMessage("empty")
				let start = texteditor.selection.start.line + 1
				let end = texteditor.selection.end.line + 1
				if(texteditor.selection.end.character === 0)
					end = end - 1
				// vscode.window.showInformationMessage("start: " + start.toString());
				// vscode.window.showInformationMessage("end: " + end.toString());
				if(start >= end){
					uri_string = uri_string + "#L" + start.toString()
				}else{
					uri_string = uri_string + "#L" + start.toString()
						+ "-L" + end.toString()
				}
			}
		}
	}
	return uri_string
}

export function activate(context: vscode.ExtensionContext) {
	// vscode.window.showInformationMessage('Congratulations, your extension "gogit" is now active!');
	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_master', () => {
		let uri = get_uri("master")
		if(uri != ""){
			vscode.env.openExternal(vscode.Uri.parse(uri));
			vscode.window.showInformationMessage(uri);	
		}
		else
			vscode.window.showInformationMessage('Please edit your repo url in setting!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_branch', () =>{
		let uri = get_uri(getbranch())
		if(uri != ""){
			vscode.env.openExternal(vscode.Uri.parse(uri));
			vscode.window.showInformationMessage(uri);	
		}
		else
			vscode.window.showInformationMessage('Please edit your repo url in setting!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_master_link', () =>{
		let uri = get_uri("master")
		if(uri != ""){
			// vscode.env.openExternal(vscode.Uri.parse(uri));
			vscode.window.showInformationMessage("UIL copied: " + uri);
			vscode.env.clipboard.writeText(uri)
		}
		else
			vscode.window.showInformationMessage('Please edit your repo url in setting!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_branch_link', () =>{
		let uri = get_uri(getbranch())
		if(uri != ""){
			// vscode.env.openExternal(vscode.Uri.parse(uri));
			vscode.window.showInformationMessage("UIL copied: " + uri);
			vscode.env.clipboard.writeText(uri)
		}
		else
			vscode.window.showInformationMessage('Please edit your repo url in setting!');
	}));
}

// this method is called when your extension is deactivated
export function deactivate() {}
