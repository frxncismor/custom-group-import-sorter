import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand('custom-group-import-sorter.Sort', () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      return;
    }

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
      'Undefined': [],
      'Group1': group1,
      'Group2': group2,
      'Group3': group3,
    };
    
    let sortedText = '';

    selections.forEach((selection) => {
      const selectedText = editor.document.getText(selection);
      const importMatches = selectedText.match(/import .* from '(.*)';/g);

      if (!importMatches) {
        return;
      }

      const groupedImports: { [key: string]: string[] } = {};

      for (const groupName in groups) {
        groupedImports[groupName] = [];
      }

      importMatches.forEach((importStatement) => {
        const lib = importStatement.match(/from '(.*)';/)![1];

        let foundGroup = false;
        for (const groupName in groups) {
          const group = groups[groupName];

          if (group.includes(lib)) {
            groupedImports[groupName].push(importStatement);
            foundGroup = true;
            break;
          }
        }

        if (!foundGroup) {
          groupedImports['Undefined'].push(importStatement);
        }
      });

      for (const groupName in groups) {
        const group = groupedImports[groupName];

        if (group.length > 0) {
          group.sort((a, b) => {
            const libA = a.match(/from '(.*)';/)![1];
            const libB = b.match(/from '(.*)';/)![1];
            return libA.localeCompare(libB);
          });

          sortedText += group.join('\n') + '\n\n';
        }
      }
    });

    editor.edit((editBuilder) => {
      selections.forEach((selection) => {
        editBuilder.replace(selection, sortedText.trim());
      });
    });
  });

  context.subscriptions.push(disposable);
}