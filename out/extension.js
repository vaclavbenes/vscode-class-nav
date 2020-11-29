"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const registerDisposableCommand = (command, callback, thisArg) => {
        let disposable = vscode.commands.registerCommand(command, callback, thisArg);
        context.subscriptions.push(disposable);
    };
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "Html Class Navigation" is now active!');
    registerDisposableCommand("extension.jumpUpToClass", () => {
        jumpToLine("up");
    });
    registerDisposableCommand("extension.jumpDownToClass", () => {
        jumpToLine("down");
    });
    registerDisposableCommand("extension.jumpIntoClass", () => {
        jumpIntoClass();
    });
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;
function jumpIntoClass() {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let currLineNumber = editor.selection.active.line;
        const line = editor.document.lineAt(currLineNumber);
        moveToEndOfQuotesTextLine(line);
    }
}
function emptySpaceAfterCursor(currLineNumber, cursorLinePos) {
    const emptySpace = " ";
    let editor = vscode.window.activeTextEditor;
    const currLineSelection = new vscode.Position(currLineNumber, cursorLinePos);
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.replace(currLineSelection, emptySpace);
        });
        moveToPosition(new vscode.Position(currLineNumber, cursorLinePos + 1));
    }
}
function cursorPositionBeforeQuote(line) {
    let count = 0;
    let index = 0;
    const letters = line.text;
    for (const letter of letters) {
        if (letter === "\"") {
            count += 1;
        }
        if (count === 2) {
            return index;
        }
        index += 1;
    }
    return null;
}
function isEmpyQuote(line) {
    return !(line === null || line === void 0 ? void 0 : line.text.includes('""'));
}
function jumpToLine(direction, regexp = /:?class/g) {
    let editor = vscode.window.activeTextEditor;
    let upLine = null;
    let downLine = null;
    if (editor) {
        let currLineNumber = editor.selection.active.line;
        let currCharPos = editor.selection.active.character;
        if (direction == "up") {
            for (let i = currLineNumber - 1; i >= 0; i--) {
                let line = editor.document.lineAt(i);
                if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
                    upLine = line;
                    break;
                }
            }
        }
        else if (direction === "down") {
            for (let i = currLineNumber + 1; i < editor.document.lineCount; i++) {
                let line = editor.document.lineAt(i);
                if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
                    downLine = line;
                    break;
                }
            }
        }
        else {
            throw new Error("Bad direction choise.");
        }
        upLine && moveToEndOfQuotesTextLine(upLine);
        downLine && moveToEndOfQuotesTextLine(downLine);
    }
}
function moveToStartOfTextLine(line) {
    moveToLine(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
}
/*
 * Move cursor into of quotes ""
 * no quotes no move
 * return cursorPosition
 */
function moveToEndOfQuotesTextLine(line) {
    const cursorLinePos = cursorPositionBeforeQuote(line);
    if (cursorLinePos) {
        moveToLine(line.lineNumber, cursorLinePos);
        isEmpyQuote(line) && emptySpaceAfterCursor(line.lineNumber, cursorLinePos);
    }
    return cursorLinePos;
}
function moveToPosition(startPos, endPos) {
    moveToLine(startPos.line, startPos.character, endPos && endPos.line, endPos && endPos.character);
}
function moveToLine(lineRangeStart, cRangeStart, lineRangeEnd, cRangeEnd) {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.selection = new vscode.Selection(new vscode.Position(lineRangeStart, cRangeStart), new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart));
        // scroll when moving out of current range
        editor.revealRange(new vscode.Range(new vscode.Position(lineRangeStart, cRangeStart), new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)));
    }
}
//# sourceMappingURL=extension.js.map