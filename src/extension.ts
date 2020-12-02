// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { cursorPositionBeforeQuote } from './cursor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed


export function activate(context: vscode.ExtensionContext) {

	const registerDisposableCommand = (command: string, callback: (...args: any[]) => any, thisArg?: any) => {
		let disposable = vscode.commands.registerCommand(command, callback, thisArg);
		context.subscriptions.push(disposable);
	};

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('"Html Class Navigation" is now active!');


	registerDisposableCommand("class-navigation.jumpUpToClass", () => {
		jumpToLine("up")
	})

	registerDisposableCommand("class-navigation.jumpDownToClass", () => {
		jumpToLine("down")
	})

	registerDisposableCommand("class-navigation.jumpIntoClass", () => {
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

		const oldLinePosition = new vscode.Position(currLineNumber, currCharPos);
		const offset = getOffset(oldLinePosition)
		removeEmptySpaceBeforeCursor(currLineNumber, currCharPos, currCharPos - offset!);

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

function replaceLineSelection(currLineSelection: vscode.Selection | vscode.Position | vscode.Range, replaceString: string) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.replace(currLineSelection, replaceString);
		})
	}

}

function insertLineSelection(currLineSelection: vscode.Position, insertString: string) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.insert(currLineSelection, insertString);
		})
	}

}

function moveToStartOfTextLine(line: vscode.TextLine): void {
	moveToLine(line.lineNumber, line.firstNonWhitespaceCharacterIndex);
}

function moveToEndOfQuotesTextLine(line: vscode.TextLine): number | null {

	const cursorLinePos = cursorPositionBeforeQuote(line)

	if (cursorLinePos) {
		moveToLine(line.lineNumber, cursorLinePos);
		if (isEmpyQuote(line)) {
			// this is bad fix !
			setTimeout(() => {
				emptySpaceAfterCursor(line.lineNumber, cursorLinePos)
			}, 100);
		}
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

function emptySpaceAfterCursor(currLineNumber: number, cursorLinePos: number): void {
	const emptySpace = " "
	insertLineSelection(new vscode.Position(currLineNumber, cursorLinePos), emptySpace)

}

function removeEmptySpaceBeforeCursor(currLineNumber: number, cursorLinePos: number, offset: number) {
	const emptySpace = ""
	const currLinePosition = new vscode.Position(currLineNumber, cursorLinePos - offset)
	const currLineSelection = new vscode.Range(currLinePosition, new vscode.Position(currLineNumber, cursorLinePos))
	replaceLineSelection(currLineSelection, emptySpace)
}

function getOffset(position: vscode.Position) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		const line = editor.document.lineAt(position.line)
		const currCharPos = position.character
		let replaceCharCount = currCharPos

		for (let i = currCharPos - 1; i >= 0; i--) {
			if (/\s/.test(line.text.charAt(i))) {
				replaceCharCount -= 1
			} else {
				break
			}
		}

		return replaceCharCount

	}
}
