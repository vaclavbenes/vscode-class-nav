"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
function selectAllInQuotes() {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        let currLineNumber = editor.selection.active.line;
        let currCursorNumber = editor.selection.active.character;
        let line = editor.document.lineAt(currLineNumber);
        let letters = line.text.split(" ");
        let index = 0;
        letters.forEach((letter) => {
            const regexp = /:?class=/g;
            if (regexp.test(letter)) {
                const letterStartIndex = line.text.indexOf(letter);
                const firstQuoteIndex = letterStartIndex + letter.indexOf('"');
                const lastQuoteIndex = letterStartIndex + letter.length;
                let offset = 1;
                console.log(`[${firstQuoteIndex}-${lastQuoteIndex}]`);
                console.log(currCursorNumber);
                const lastChar = line.text.charAt(lastQuoteIndex - 1);
                if (lastChar === ">") {
                    offset = 2;
                }
                if (isInRange(currCursorNumber, [firstQuoteIndex, lastQuoteIndex])) {
                    console.log("in range");
                    selectionRange(line, firstQuoteIndex + 1, lastQuoteIndex - offset);
                }
                else {
                    console.log("not in range");
                }
            }
            index += 1;
        });
    }
}
const isOneLineTag = (letters) => {
    const trimmedLetter = letters.trim();
    return (trimmedLetter.startsWith("<") && trimmedLetter.endsWith(">")) ? true : false;
};
const isStartTag = (letters) => {
    const trimmedLetter = letters.trim();
    return (trimmedLetter.startsWith("<") && !trimmedLetter.endsWith(">")) ? true : false;
};
const isMiddleTag = (letters) => {
    const trimmedLetter = letters.trim();
    return (!trimmedLetter.startsWith("<") && !trimmedLetter.endsWith(">")) ? true : false;
};
const isEdTag = (letters) => {
    const trimmedLetter = letters.trim();
    return (!trimmedLetter.startsWith("<") && trimmedLetter.endsWith(">")) ? true : false;
};
function isInRange(value, range) {
    const [first, last] = range;
    if (first <= value && value <= last) {
        return true;
    }
    else {
        return false;
    }
}
function selectionRange(line, startCharPosition, endCharPosition) {
    let editor = vscode.window.activeTextEditor;
    if (editor) {
        editor.selection = new vscode.Selection(new vscode.Position(line.lineNumber, startCharPosition), new vscode.Position(line.lineNumber, endCharPosition));
    }
}
const rangesForSelection = (letters) => {
    // work only with one class in line
    const magicWord = "class=";
    const words = [];
    let flag = false;
    for (const word of letters) {
        let _word = "";
        if (word.startsWith(magicWord)) {
            flag = true;
        }
        else if (word.endsWith('"')) {
            words.push(removeSpecialChars(word));
            break;
        }
        else if (word.includes(">")) {
            _word = splitWord(word);
            words.push(removeSpecialChars(_word));
            break;
        }
        _word = splitWord(word);
        _word = removeSpecialChars(_word);
        flag && words.push(_word);
    }
};
const removeSpecialChars = (word) => {
    const listOfChars = ["\"", ">", "<", "'", "class="];
    listOfChars.forEach(char => {
        word = word.replace(char, "");
    });
    return word;
};
const splitWord = (word) => {
    // return first part of string
    return word.split(">")[0];
};
function getLineUp(channel) {
    let editor = vscode.window.activeTextEditor;
    let previous;
    let next;
    if (editor) {
        const magic = "class";
        let currLine = editor.selection.active.line;
        for (let i = currLine - 1; i >= 0; i--) {
            let line = editor.document.lineAt(i);
            if (!line.isEmptyOrWhitespace && line.text.trim().includes(magic)) {
                previous = line;
                channel.appendLine(previous.text);
                break;
            }
        }
    }
}
//# sourceMappingURL=futureUtils.js.map