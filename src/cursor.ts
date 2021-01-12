import { TextLine } from 'vscode'



const positionBeforeSecondQuote = (letters: string): number | null => {
    let count = 0
    let index = 0


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

export function cursorPositionInClassTag(line: TextLine): number | null {

    const tag = "class="


    if (!line.text.includes(tag)) return null

    const tagStartIndex = line.text.indexOf(tag) + tag.length

    const dataAfterClass = line.text.slice(tagStartIndex, line.text.length)

    const pos = positionBeforeSecondQuote(dataAfterClass) || 0

    return tagStartIndex + pos
}


