import * as vscode from 'vscode';
import { currCharPos } from './extension';
import { insertLineSelection, moveToLine, removeLineSelection } from "./Line"


/** Create class param on cursor position
 *
 * @param line
 */
export function createClassTag(line: vscode.TextLine, cursorLinePos: number) {

    const currLineNumber = line.lineNumber

    const insertString = 'class=""'

    if (cursorLinePos) {
        insertLineSelection(new vscode.Position(currLineNumber, cursorLinePos), insertString,
            () => moveToLine(line.lineNumber, cursorLinePos + insertString.length - 1))
    }
}


export function removeClassTag(line: vscode.TextLine, name = "class") {
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

export const isSingleTag = (text: string): boolean => {
    const reg = RegExp("<[a-z].*>")
    if (reg.test(text.trim())) {
        return true
    } else {
        return false
    }
}

export const isClassTag = (text: string): boolean => {
    if (text.includes("class=")) {
        return true
    } else {
        return false
    }
}