import { TextLine } from 'vscode'

export function cursorPositionBeforeQuote(line: TextLine): number | null {
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


export function cursorPositionBeforeCloseTag(line: TextLine): number | null {
    const letters = line.text

    let index = 0

    for (const letter of letters) {
        if (letter === ">") {
            return index
        }
        index += 1

    }
    return null
}