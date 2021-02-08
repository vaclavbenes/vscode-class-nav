// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { createClassInDownTag, createClassInUpperTag } from './Attribute';
import { cursorPositionBeforeCloseTag, cursorPositionBeforeQuote, cursorPositionInClassTag } from './cursor';
import { getClosestLineWithoutTag, getLine, getLines, insertLineSelectionSpace, jumpToLine, moveToLine } from './Line';
import { createClassTag, isClassTag, removeClassTag } from './Tag';

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


/**
 * TODO: modify this for multiple selection  *
 */

function jumpIntoClass() {
	const line = getLine()
	// const lines = getLines()

	// lines?.forEach(async line => {
	// 	console.log(line);
	line && moveToClassTag(line)
	// })

}

function isEmpyQuote(line: vscode.TextLine): boolean {
	return !line?.text.includes('""')
}


export function moveToClassTag(line: vscode.TextLine) {

	if (!isClassTag(line.text)) {

		const cursorLinePos = moveToEndOfCloseTag(line)

		if (cursorLinePos) {

			createSpaceAndMove(line, cursorLinePos, () => {
				createClassTag(line, cursorLinePos)
			})

		}
	}

	if (isClassTag(line.text)) {
		const cursorLinePos = cursorPositionInClassTag(line)

		if (cursorLinePos) {
			moveToLine(line.lineNumber, cursorLinePos)

			if (isEmpyQuote(line)) {
				// this is bad fix !
				setTimeout(() => {
					emptySpaceAfterCursor(line.lineNumber, cursorLinePos, () => { })
				}, 300);
			}
		}

	}


}


function createSpaceAndMove(line: vscode.TextLine, cursorLinePos: number, callback: () => any): number {

	let _cursorLinePos = cursorLinePos

	_cursorLinePos = emptySpaceAfterCursor(line.lineNumber, cursorLinePos,
		() => {
			moveToLine(line.lineNumber, _cursorLinePos)
			createClassTag(line, _cursorLinePos)
		})


	return _cursorLinePos
}


function moveToEndOfQuotesTextLine(line: vscode.TextLine): number | null {


	const cursorLinePos = cursorPositionBeforeQuote(line)

	if (cursorLinePos) {
		moveToLine(line.lineNumber, cursorLinePos);
		if (isEmpyQuote(line)) {
			// this is bad fix !
			setTimeout(() => {
				// emptySpaceAfterCursor(line.lineNumber, cursorLinePos)
			}, 200);
		}
	}

	return cursorLinePos
}


/** Move you cursor to end of close tag "<div >"
 *
 * @param line
 * @returns cursorLinePos
 */
function moveToEndOfCloseTag(line: vscode.TextLine): number | null {
	const cursorLinePos = cursorPositionBeforeCloseTag(line)

	cursorLinePos && moveToLine(line.lineNumber, cursorLinePos);

	return cursorLinePos
}



function emptySpaceAfterCursor(currLineNumber: number, cursorLinePos: number, callback: () => any): number {
	const emptySpace = " "
	insertLineSelectionSpace(new vscode.Position(currLineNumber, cursorLinePos), emptySpace, callback)
	return cursorLinePos + emptySpace.length
}




