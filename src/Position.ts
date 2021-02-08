import * as vscode from 'vscode';
import { moveToLine } from './Line';

function moveToPosition(startPos: vscode.Position, endPos?: vscode.Position): void {
    moveToLine(startPos.line, startPos.character, endPos && endPos.line, endPos && endPos.character);
}

