import * as vscode from 'vscode';
import { cursorPositionBeforeCloseTag } from './cursor';
import { moveToCloseClassTag, emptySpaceAfterCursor } from './extension';
import { changePreviousSelection, isEmptySpaceBefore } from './futureUtils';
import { isClassTag } from './Tag';



export function jumpToLine(direction: "up" | "down", regexp = /:?class/g) {
    changePreviousSelection() // TODO: fix this


    let changeLine = getClosestLine(direction, regexp);
    changeLine && moveToCloseClassTag(changeLine)


    setTimeout(() => {
        emptySpaceAfterCursor()
    }, 100);

}

export function replaceLineSelection(currLineSelection: vscode.Selection | vscode.Position | vscode.Range, replaceString: string) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.replace(currLineSelection, replaceString);
        }, { undoStopBefore: true, undoStopAfter: false })


    }

}

export function removeLineSelection(currLineSelection: vscode.Selection | vscode.Range) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.delete(currLineSelection);
        }, { undoStopBefore: true, undoStopAfter: false })
    }

}

export function insertLineSelection(currLineSelection: vscode.Position, insertString: string, callback?: () => void) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(currLineSelection, insertString);
        }, { undoStopBefore: true, undoStopAfter: false }).then(() => {
            callback && callback()
        })




    }
}

export function insertLineSelectionSpace(currLineSelection: vscode.Position, insertString: string, callback?: () => void) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.edit(editBuilder => {
            editBuilder.insert(currLineSelection, insertString);
        }).then(() => {
            callback && callback()
        })
    }
}

export const getClosestLineWithoutTag = (direction: "up" | "down", regexp: RegExp) => {
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


export const getClosestLine = (direction: "up" | "down", regexp: RegExp) => {
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

export function moveToLine(lineRangeStart: number, cRangeStart: number, lineRangeEnd?: number, cRangeEnd?: number): vscode.Selection {
    const editor = vscode.window.activeTextEditor;

    let selection = null


    if (editor) {
        selection = new vscode.Selection(
            new vscode.Position(lineRangeStart, cRangeStart),
            new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
        );

        // scroll when moving out of current range
        editor.revealRange(new vscode.Range(
            new vscode.Position(lineRangeStart, cRangeStart),
            new vscode.Position(lineRangeEnd ? lineRangeEnd : lineRangeStart, cRangeEnd ? cRangeEnd : cRangeStart)
        ));

        editor.selection = selection;

    }

    return selection!
}

/**
 * Modify selection for multi select
 * @returns
 */
export function getLine(selection: vscode.Selection): vscode.TextLine | null {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let currLineNumber = selection.active.line;
        const line = editor.document.lineAt(currLineNumber);
        return line
    }
    return null
}


export function getLines(): vscode.TextLine[] | null {
    let editor = vscode.window.activeTextEditor;


    if (editor) {
        let doc: vscode.TextDocument = editor.document;

        let selections = editor.selections;


        editor.selections = selections.map(selection => {

            let line: number | null = null

            for (let i = selection.start.line; i <= selection.end.line; i++) {

                line = i

            }

            let character = cursorPositionBeforeCloseTag(doc.lineAt(line!))


            return new vscode.Selection(
                new vscode.Position(line!, character!),
                new vscode.Position(line!, character!)
            );

        })



    }

    return null
}