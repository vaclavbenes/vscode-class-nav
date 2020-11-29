// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


export function activate(context: vscode.ExtensionContext) {

	const registerDisposableCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
		let disposable = vscode.commands.registerCommand(command, callback, thisArg);
		context.subscriptions.push(disposable);
	};

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "Html Class Navigation" is now active!');


	registerDisposableCommand("extension.jumpUpToClass", () => {
		jumpToLine("up")
	})

	registerDisposableCommand("extension.jumpDownToClass", () => {
		jumpToLine("down")
	})

	registerDisposableCommand("extension.jumpIntoClass", () => {
		jumpIntoClass()
	})
}

// this method is called when your extension is deactivated
export function deactivate() { }


function jumpIntoClass() {
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let currLineNumber = editor.selection.active.line;
		const line = editor.document.lineAt(currLineNumber);
		moveToEndOfQuotesTextLine(line)
	}
}

function emptySpaceAfterCursor(currLineNumber: number, cursorLinePos: number): void {
	const emptySpace = " "
	let editor = vscode.window.activeTextEditor;
	const currLineSelection = new vscode.Position(currLineNumber, cursorLinePos)

	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.replace(currLineSelection, emptySpace)
		})

		moveToPosition(new vscode.Position(currLineNumber, cursorLinePos + 1))
	}

}

function cursorPositionBeforeQuote(line: vscode.TextLine): number | null {
	let count = 0
	let index = 0

	const letters = line.text

	for (const letter of letters) {
		if (letter === "\"") {
			count += 1
		}

		if (count === 2) {
			return index
		}

		index += 1
	}
	return null
}

function isEmpyQuote(line: vscode.TextLine): boolean {
	return !line?.text.includes('""')
}


function jumpToLine(direction: "up" | "down", regexp = /:?class/g) {
	let editor = vscode.window.activeTextEditor;
	let upLine: vscode.TextLine | null = null
	let downLine: vscode.TextLine | null = null

	if (editor) {
		let currLineNumber = editor.selection.active.line;
		let currCharPos = editor.selection.active.character

		if (direction == "up") {
			for (let i = currLineNumber - 1; i >= 0; i--) {
				let line = editor.document.lineAt(i);
				if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
					upLine = line;
					break;
				}
			}
		} else if (direction === "down") {
			for (let i = currLineNumber + 1; i < editor.document.lineCount; i++) {
				let line = editor.document.lineAt(i);
				if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
					downLine = line;
					break;
				}
			}
		} else {
			throw new Error("Bad direction choise.");

		}


		upLine && moveToEndOfQuotesTextLine(upLine)
		downLine && moveToEndOfQuotesTextLine(downLine)


	}

}

function moveToStartOfTextLine(line: vscode.TextLine): void {
	moveToLine(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
}

/*
 * Move cursor into of quotes ""
 * no quotes no move
 * return cursorPosition
 */
function moveToEndOfQuotesTextLine(line: vscode.TextLine): number | null {
	const cursorLinePos = cursorPositionBeforeQuote(line)

	if (cursorLinePos) {
		moveToLine(line.lineNumber, cursorLinePos);
		isEmpyQuote(line) && emptySpaceAfterCursor(line.lineNumber, cursorLinePos)
	}

	return cursorLinePos
}

function moveToPosition(startPos: vscode.Position, endPos?: vscode.Position): void {
	moveToLine(startPos.line, startPos.character, endPos && endPos.line, endPos && endPos.character);
}

function moveToLine(lineRangeStart: number, cRangeStart: number, lineRangeEnd?: number, cRangeEnd?: number): void {
	const editor = vscode.window.activeTextEditor;

	if (editor) {
		editor.selection = new vscode.Selection(
			new vscode.Position(lineRangeStart, cRangeStart),
			new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
		);

		// scroll when moving out of current range
		editor.revealRange(new vscode.Range(
			new vscode.Position(lineRangeStart, cRangeStart),
			new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
		));
	}
}


