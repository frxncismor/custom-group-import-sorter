import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('custom-group-import-sorter.Sort', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

    const document = editor.document;
    const selections = editor.selections;

    if (selections.length === 0) {
      vscode.window.showInformationMessage('Nothing selected.');
      return;
    }

    const configuration = vscode.workspace.getConfiguration('custom-group-import-sorter');
    const group1: string[] = configuration.get('Group1', []);
    const group2: string[] = configuration.get('Group2', []);
    const group3: string[] = configuration.get('Group3', []);

    const groups: { [key: string]: string[] } = {
      Group1: group1,
      Group2: group2,
      Group3: group3,
      GroupUndefined: []
    };

    const groupedImports: { [key: string]: string[] } = {};
    const sortedTexts: string[] = [];

    selections.forEach((selection) => {
      const selectedText = document.getText(selection);
      const importMatches = selectedText.match(/import .* from '(.*)';/g);

      if (!importMatches) {
        return;
      }

      groupedImports['GroupUndefined'] = [];

      importMatches.forEach((importStatement) => {
        const lib = importStatement.match(/from '(.*)';/)![1];

        let isGroupFound = false;
        for (const groupName in groups) {
          if (groupName === 'GroupUndefined') {
            continue;
          }
            
          const group = groups[groupName];

          if (group.some((item) => lib.startsWith(item))) {
            if (!groupedImports[groupName]) {
              groupedImports[groupName] = [];
            }
            groupedImports[groupName].push(importStatement);
            isGroupFound = true;
            break;
          }
        }

        if (!isGroupFound) {
          groupedImports['GroupUndefined'].push(importStatement);
        }
      });

      const sortedImports: string[] = [];
      for (const groupName in groups) {
        const group = groupedImports[groupName];

        if (group && group.length > 0) {
          group.sort((a, b) => {
            const libA = a.match(/from '(.*)';/)![1];
            const libB = b.match(/from '(.*)';/)![1];
            return libA.localeCompare(libB);
          });

          sortedImports.push(...group, '');
        }
      }

      sortedTexts.push(sortedImports.join('\n'));
    });

    editor.edit((editBuilder) => {
      selections.forEach((selection, index) => {
        const sortedText = sortedTexts[index].trim();
        editBuilder.replace(selection, sortedText);
      });
    });
  });

  context.subscriptions.push(disposable);
}