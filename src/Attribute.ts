import * as vscode from 'vscode';
import { getClosestLineWithoutTag, getLine } from './Line';
import { removeClassTag } from './Tag';



class Attribute {
    name = "class"

    constructor(name?: string) {
        if (name) {
            this.name = name
        }
    }

    create() {
        // const actualLine = getLine()
        // create atribute by name
        // actualLine && createClassTag(actualLine)
    }
    remove() {
        // const actualLine = getLine()
        // actualLine && removeClassTag(actualLine)
    }
}


export const tag = new Attribute()





export function createClassInUpperTag() {
    tag.remove()

    setTimeout(() => {
        let changeLine = getClosestLineWithoutTag("up", RegExp("<[a-z].*>"));
        // createClass(changeLine)
    }, 100);

}

export function createClassInDownTag() {
    tag.remove()

    setTimeout(() => {
        let changeLine = getClosestLineWithoutTag("down", RegExp("<[a-z].*>"));
        // createClass(changeLine)
    }, 100);
}