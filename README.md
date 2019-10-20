# gogit README

## Features

Go to git repo and open current viewed file.

## Requirements

Workspace folder must be a git repo.

## Extension Settings

Add `"gogit.url": "https://git-repo_url"` in project setting under `.vscode` file.

## Usage

Open Command Palette with shortcut `⇧⌘P`,
  and type `gogit`, there will be 4 different command:

- Go Git(master)
- Go Git(branch)
- Go Git(copy master link)
- Go Git(copy branch link)

you can open/copy link of git repo and locate current active doc(lines) in master/branch.

## Development

Generate `.vsix` package:

```bash
vsce package
```

Publish with version:

```bash
vsce publish 0.0.0
```

## Test

1. markdown lint test

Tests are required before publish.

### markdown lint test

```bash
markdownlint --config .markdownlintrc ./README.md
```

Fix lint errors if any.

You may need to install it before first using:

```bash
sudo npm install -g markdownlint-cli
```

## TODO list

- Add test case and test doc.

## Release Notes

Users appreciate release notes as you update your extension.

### 0.1.0

First release.

### 0.1.2

Fix publish issue

### 0.1.4

Support git branch

### 0.1.5

Fix uri issue and update doc

-----------------------------------------------------------------------------------------------------------

### For more information

- [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
- [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
