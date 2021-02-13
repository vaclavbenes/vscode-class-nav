// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createClassInDownTag, createClassInUpperTag } from './Attribute';
import { cursorPositionBeforeCloseTag, cursorPositionBeforeQuote, cursorPositionInClassTag } from './cursor';
import { isEmptySpaceBefore } from './futureUtils';
import { getLine, jumpToLine, moveToLine } from './Line';
import { isClassTag } from './Tag';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

let flag = false

//TODO: use only in vue or html or other html framework
//TODO: use classes and use more object logic
//TODO:  doesn not work in  <a href="# " class="text-base text-gray-900 ml-3"
//TODO create class in div and jump up and down

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

	registerDisposableCommand("class-navigation.createClass", () => {
		jumpIntoClass()
	})

	registerDisposableCommand("class-navigation.createClassInUpperTag", () => {
		createClassInUpperTag()
	})

	registerDisposableCommand("class-navigation.createClassInDownTag", () => {
		createClassInDownTag()
	})
}

// this method is called when your extension is deactivated
export function deactivate() { }



export const currCharPos = (): number | null => {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		return editor.selection.active.character
	}
	return null
}

export const currEditor = () => {
	let editor = vscode.window.activeTextEditor;
	return editor
}


/**
 * TODO: modify this for multiple selection  *
 */

function jumpIntoClass() {

	moveToEndOfCloseTag()
	insertText(" class=\"\"", () => {
		moveToEndOfQuotesTextLine()
	})

}

function isEmptyQuote(text: string): boolean {
	return !text.includes('""')
}


export function moveToCloseClassTag(closeLine: vscode.TextLine): Boolean {
	let flag = true

	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let selections = editor.selections

		editor.selections = selections.map(selection => {
			const line = closeLine
			let cursorLinePos = selection.active.character

			if (isClassTag(line!.text)) {
				const _cursorLinePos = cursorPositionInClassTag(line!)
				if (_cursorLinePos) {
					cursorLinePos = _cursorLinePos
					flag = false
				}
			}
			return moveToLine(line!.lineNumber, cursorLinePos!);
		})

	}
	return flag

}

export function moveToClassTag(): Boolean {
	let flag = true

	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let selections = editor.selections
		editor.selections = selections.map(selection => {
			const line = getLine(selection)
			let cursorLinePos = selection.active.character

			if (isClassTag(line!.text)) {
				const _cursorLinePos = cursorPositionInClassTag(line!)
				if (_cursorLinePos) {
					cursorLinePos = _cursorLinePos
					flag = false
				}
			}
			return moveToLine(line!.lineNumber, cursorLinePos!);
		})

	}

	return flag

}


export function insertText(text: string, callback: any = null, ignore: boolean = false) {
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let selections = editor.selections

		editor.edit(editBuilder => {
			selections.forEach(selection => {
				const pos = selection.active
				const line = getLine(selection)

				console.log("isEmptyQuote", isEmptyQuote(line!.text));

				if (isClassTag(line!.text) == false) {
					editBuilder.insert(pos, text)
				}

				else if ((ignore) && isEmptyQuote(line!.text)) {
					editBuilder.insert(pos, text)
				}

			})
		}).then(() => {
			callback && callback()
		})
	}
}


export function moveToEndOfQuotesTextLine() {

	let editor = vscode.window.activeTextEditor;

	if (editor) {

		let selections = editor.selections

		editor.edit(editBuilder => {

			editor!.selections = selections.map(selection => {
				const line = getLine(selection)

				const cursorLinePos = cursorPositionBeforeQuote(line!)

				return moveToLine(line!.lineNumber, cursorLinePos!);
			})

			emptySpaceAfterCursor()

		})
	}
}

/** Move you cursor to end of close tag "<div|>"
 *
 * @param line
 * @returns cursorLinePos
 */
export function moveToEndOfCloseTag() {
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let selections = editor.selections

		editor.selections = selections.map(selection => {
			const line = getLine(selection)
			const cursorLinePos = cursorPositionBeforeCloseTag(line!)
			return moveToLine(line!.lineNumber, cursorLinePos!);
		})
	}

}


/**
 * Create empty space after cursor
 * timeout troubles
 */
export function emptySpaceAfterCursor(): void {
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		const emptySpace = " "
		let selections = editor.selections

		editor.edit(editBuilder => {
			selections.forEach(selection => {
				const pos = selection.active
				if (!isEmptySpaceBefore(pos)) {
					editBuilder.insert(pos, emptySpace)
				}
			})
		})



	}
}




