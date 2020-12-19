// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { cursorPositionBeforeCloseTag, cursorPositionBeforeQuote } from './cursor';

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
		createClass()
	})

	registerDisposableCommand("class-navigation.createClassInUpperTag", () => {
		createClassInUpperTag()
	})
}

// this method is called when your extension is deactivated
export function deactivate() { }




function createClassInUpperTag() {

	const actualLine = getLine()
	actualLine && removeClassTag(actualLine)

	setTimeout(() => {
		let changeLine = getClosestLineWithoutTag("up", RegExp("<[a-z].*>"));
		createClass(changeLine)
	}, 100);

}


class Tag {
	name = "class"
	constructor(private line: vscode.TextLine) { }

	create() {
		createClassTag(this.line)
	}
}

function createClass(line: vscode.TextLine | null = null) {

	if (!line) line = getLine()

	if (line) {
		console.log(line, isSingleTag(line.text));

		if (isSingleTag(line.text) && !isClassTag(line.text)) {
			createClassTag(line)
		} else {
			// is not tag or is complicated tag
		}

	}

}

function createClassTag(line: vscode.TextLine) {
	const cursorLinePos = moveToEndOfCloseTag(line)
	const currLineNumber = line.lineNumber

	const insertString = 'class=""'

	if (cursorLinePos) {
		insertLineSelection(new vscode.Position(currLineNumber, cursorLinePos), insertString)
		moveToLine(line.lineNumber, cursorLinePos + insertString.length);
	}
}

function removeClassTag(line: vscode.TextLine, name = "class") {
	const currLineNumber = line.lineNumber
	let cursorLinePos = currCharPos()

	const tag = name + "=\"\""

	if (line.text.includes(tag)) {
		if (cursorLinePos) {
			const currLineSelection = new vscode.Range(
				new vscode.Position(currLineNumber, cursorLinePos - tag.length),
				new vscode.Position(currLineNumber, cursorLinePos + 1))
			removeLineSelection(currLineSelection)

		}
	}
}


const currCharPos = (): number | null => {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		return editor.selection.active.character
	}
	return null
}



const isSingleTag = (text: string): boolean => {
	const reg = RegExp("<[a-z].*>")
	if (reg.test(text.trim())) {
		return true
	} else {
		return false
	}
}

const isClassTag = (text: string): boolean => {
	if (text.includes("class=")) {
		return true
	} else {
		return false
	}
}

function jumpIntoClass() {
	const line = getLine()
	line && moveToEndOfQuotesTextLine(line)
}

function isEmpyQuote(line: vscode.TextLine): boolean {
	return !line?.text.includes('""')
}

function getLine(): vscode.TextLine | null {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		let currLineNumber = editor.selection.active.line;
		const line = editor.document.lineAt(currLineNumber);
		return line
	}
	return null
}


const getClosestLineWithoutTag = (direction: "up" | "down", regexp: RegExp) => {
	let editor = vscode.window.activeTextEditor;
	let changeLine: vscode.TextLine | null = null

	if (editor) {
		let currLineNumber = editor.selection.active.line;
		if (direction == "up") {
			for (let i = currLineNumber - 1; i >= 0; i--) {
				let line = editor.document.lineAt(i);
				if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim()) && !isClassTag(line.text.trim())) {
					changeLine = line;
					break;
				}
			}
		} else if (direction === "down") {
			for (let i = currLineNumber + 1; i < editor.document.lineCount; i++) {
				let line = editor.document.lineAt(i);
				if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim()) && !isClassTag(line.text.trim())) {
					changeLine = line;
					break;
				}
			}
		} else {
			throw new Error("Bad direction choise.");
		}
	}
	return changeLine

}



const getClosestLine = (direction: "up" | "down", regexp: RegExp) => {
	let editor = vscode.window.activeTextEditor;
	let changeLine: vscode.TextLine | null = null

	if (editor) {
		let currLineNumber = editor.selection.active.line;
		if (direction == "up") {
			for (let i = currLineNumber - 1; i >= 0; i--) {
				let line = editor.document.lineAt(i);
				if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
					changeLine = line;
					break;
				}
			}
		} else if (direction === "down") {
			for (let i = currLineNumber + 1; i < editor.document.lineCount; i++) {
				let line = editor.document.lineAt(i);
				if (!line.isEmptyOrWhitespace && regexp.test(line.text.trim())) {
					changeLine = line;
					break;
				}
			}
		} else {
			throw new Error("Bad direction choise.");
		}
	}
	return changeLine
}

const changePreviousSelection = () => {
	let editor = vscode.window.activeTextEditor;

	if (editor) {
		let currLineNumber = editor.selection.active.line;
		let currCharPos = editor.selection.active.character

		// change previous edit
		const oldLinePosition = new vscode.Position(currLineNumber, currCharPos);
		const offset = getOffset(oldLinePosition)
		removeEmptySpaceBeforeCursor(currLineNumber, currCharPos, currCharPos - offset!);
	}

}

function jumpToLine(direction: "up" | "down", regexp = /:?class/g) {
	changePreviousSelection()

	let changeLine = getClosestLine(direction, regexp);
	changeLine && moveToEndOfQuotesTextLine(changeLine)
}

function replaceLineSelection(currLineSelection: vscode.Selection | vscode.Position | vscode.Range, replaceString: string) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.replace(currLineSelection, replaceString);
		})
	}

}

function removeLineSelection(currLineSelection: vscode.Selection | vscode.Range) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.delete(currLineSelection);
		})
	}

}

function insertLineSelection(currLineSelection: vscode.Position, insertString: string) {
	let editor = vscode.window.activeTextEditor;
	if (editor) {
		editor.edit(editBuilder => {
			editBuilder.insert(currLineSelection, insertString);
		}).then(() => {
			flag = true
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
			}, 200);
		}
	}

	return cursorLinePos
}


function checkFlag(line: vscode.TextLine) {
	if (flag == false) {
		setTimeout(checkFlag, 100); /* this checks the flag every 100 milliseconds*/
	} else {
		moveToEndOfQuotesTextLine(line)
	}
}


function moveToEndOfCloseTag(line: vscode.TextLine): number | null {
	const cursorLinePos = cursorPositionBeforeCloseTag(line)

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
		setTimeout(() => {
			editor.selection = new vscode.Selection(
				new vscode.Position(lineRangeStart, cRangeStart),
				new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
			);

			// scroll when moving out of current range
			editor.revealRange(new vscode.Range(
				new vscode.Position(lineRangeStart, cRangeStart),
				new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
			));
		}, 100);
	}
}

function emptySpaceAfterCursor(currLineNumber: number, cursorLinePos: number): void {
	const emptySpace = " "
	insertLineSelection(new vscode.Position(currLineNumber, cursorLinePos), emptySpace)

}

function removeEmptySpaceBeforeCursor(currLineNumber: number, cursorLinePos: number, offset: number) {
	const emptySpace = ""
	const currLineSelection = new vscode.Range(
		new vscode.Position(currLineNumber, cursorLinePos - offset),
		new vscode.Position(currLineNumber, cursorLinePos))
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
