import { TextLine } from 'vscode'
import { cursorPositionBeforeQuote } from "../../cursor";
import { expect } from 'chai';


describe('Cursor Position Before Line', () => {

    it('Sample 1', () => {

        const line = { text: "<div class=\"\"></div>" } as TextLine
        const pos = cursorPositionBeforeQuote(line)
        expect(pos).equal(12)
    });

    it('Sample 2', () => {

        const line = { text: "<div class=\"block1 block2\"></div>" } as TextLine
        const pos = cursorPositionBeforeQuote(line)
        expect(pos).equal(25)
    });

    it('Sample 3', () => {

        const line = { text: "  <div class=\"block1 block2\"></div>" } as TextLine
        const pos = cursorPositionBeforeQuote(line)
        expect(pos).equal(27)
    });

    it('Sample 4', () => {
        const line = { text: "<div class=\"block1\"" } as TextLine
        const pos = cursorPositionBeforeQuote(line) //?
        expect(pos).equal(18)
    });
})
