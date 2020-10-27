import * as vscode from 'vscode';

function getcd(workspacepath : string): string{
	var system = require('os').type()
	var cd = ""
	if(system == "Windows_NT"){ // windows platform
		if(workspacepath[0] != 'c')
			cd = "cd /" + workspacepath[0] + " " + workspacepath
		else
			cd = "cd " + workspacepath;
	}else if(system == "Darwin"){ // macOS
		cd = "cd " + workspacepath
	}else{ // Linux, TODO
		cd = "cd " + workspacepath
	}
	return cd;
}
function getbranch() : string{
	var execSync = require('child_process').execSync;
	if(vscode.workspace.workspaceFolders == undefined){
		vscode.window.showInformationMessage("No workspace folder found!");
		return "master";
	}
	const workspacepath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()
	const cd = getcd(workspacepath);
	const branch = execSync(cd + "&& git branch --show-current").toString().trim()
	// vscode.window.showInformationMessage(branch);	
	return branch;
}

function getcommit() : string{
	var execSync = require('child_process').execSync;
	if(vscode.workspace.workspaceFolders == undefined){
		vscode.window.showInformationMessage("No workspace folder found!");
		return "master";
	}
	const workspacepath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()
	const cd = getcd(workspacepath);
	const commit = execSync(cd + "&& git rev-parse HEAD").toString().trim()
	// vscode.window.showInformationMessage(branch);	
	return commit;
}

function getremote(cd : string) : string{
	var execSync = require('child_process').execSync;
	if(vscode.workspace.workspaceFolders == undefined){
		vscode.window.showInformationMessage("No workspace folder found!");
		return "master";
	}
	const remote = execSync(cd + "&& git remote").toString().trim()
	// vscode.window.showInformationMessage(branch);	
	return remote;
}

function geturi(cd : string) : string{
	const execSync = require('child_process').execSync
	const remote = getremote(cd);
	execSync(cd)
	// var full_uri = execSync("git config --get remote." + remote + ".url")
	var full_uri = execSync(cd + " && git config --get remote." + remote + ".url").toString().trim()
	return full_uri
}

function get_cs_uri(commit:string) : string | undefined{
	// const config = vscode.workspace.getConfiguration('gogit');
	// const uri = config.get<vscode.Uri>('url')
	const execSync = require('child_process').execSync
	if(vscode.workspace.workspaceFolders == undefined){
		vscode.window.showInformationMessage("No workspace folder found!");
		return;
	}
	const workspacepath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()
	const cd = getcd(workspacepath)
	const full_uri = execSync(cd + " && git config --get remote.origin.url").toString().trim()
	const short_uri = full_uri.endsWith(".git") ? full_uri.substring(0, full_uri.length - 4).split('/') : full_uri.split('/');
	const uri = short_uri[short_uri.length - 2] + '/' + short_uri[short_uri.length - 1]
	console.log(uri)
	let uri_string = "https://sourcegraph.d.musta.ch/" + uri + "@" + commit + "/-/blob/"
	console.log(uri_string)
	if(uri != undefined){
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
				uri_string = uri_string + relativepath
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
	console.log(uri_string)
	return uri_string
}

function get_uri(branch:string) : string | undefined{
	// const config = vscode.workspace.getConfiguration('gogit');
	// const uri = config.get<vscode.Uri>('url')
	var system = require('os').type()
	const execSync = require('child_process').execSync
	if(vscode.workspace.workspaceFolders == undefined){
		vscode.window.showInformationMessage("No workspace folder found!");
		return;
	}
	const workspacepath = vscode.workspace.workspaceFolders[0].uri.fsPath.toString()
	const cd = getcd(workspacepath)
	var full_uri = geturi(cd)

	const uri = full_uri.endsWith(".git") ? full_uri.substring(0, full_uri.length - 4) : full_uri;
	// console.log(uri)
	let uri_string = ""
	if(uri != undefined){
		uri_string = uri.toString()
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
		if(uri && uri != ""){
			vscode.env.openExternal(vscode.Uri.parse(uri));
			// vscode.window.showInformationMessage(uri);	
		}
		else
			vscode.window.showInformationMessage('Your workspace folder is not a git repo!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_branch', () =>{
		let uri = get_uri(getbranch())
		// vscode.window.showInformationMessage(getbranch());	
		if(uri && uri != ""){
			vscode.env.openExternal(vscode.Uri.parse(uri));
			// vscode.window.showInformationMessage(uri);	
		}
		else
		vscode.window.showInformationMessage('Your workspace folder is not a git repo!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_master_link', () =>{
		let uri = get_uri("master")
		if(uri && uri != ""){
			// vscode.env.openExternal(vscode.Uri.parse(uri));
			vscode.window.showInformationMessage("UIL copied: " + uri);
			vscode.env.clipboard.writeText(uri)
		}
		else
		vscode.window.showInformationMessage('Your workspace folder is not a git repo!');
	}));

	context.subscriptions.push(vscode.commands.registerCommand('extension.gogit_branch_link', () =>{
		let uri = get_uri(getbranch())
		if(uri && uri != ""){
			// vscode.env.openExternal(vscode.Uri.parse(uri));
			vscode.window.showInformationMessage("UIL copied: " + uri);
			vscode.env.clipboard.writeText(uri)
		}
		else
		vscode.window.showInformationMessage('Your workspace folder is not a git repo!');
	}));

	// context.subscriptions.push(vscode.commands.registerCommand('extension.gocs', () =>{
	// 	let uri = get_cs_uri(getcommit())
	// 	if(uri && uri != ""){
	// 		vscode.env.openExternal(vscode.Uri.parse(uri));
	// 		// vscode.window.showInformationMessage(uri);	
	// 		// vscode.env.clipboard.writeText(uri)
	// 	}
	// 	else
	// 	vscode.window.showInformationMessage('Your workspace folder is not a git repo!');
	// }));

	// context.subscriptions.push(vscode.commands.registerCommand('extension.gocs_link', () =>{
	// 	let uri = get_cs_uri(getcommit())
	// 	if(uri && uri != ""){
	// 		// vscode.env.openExternal(vscode.Uri.parse(uri));
	// 		vscode.window.showInformationMessage("UIL copied: " + uri);
	// 		vscode.env.clipboard.writeText(uri)
	// 	}
	// 	else
	// 	vscode.window.showInformationMessage('Your workspace folder is not a git repo!');
	// }));
}

// this method is called when your extension is deactivated
export function deactivate() {}
