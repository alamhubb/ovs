import {ECMAScript5Parser} from "../ecma5/ecma5_parser";

export class ECMAScript6Parser extends ECMAScript5Parser {
    constructor(isInvokedByChildConstructor = false) {
        super()
        const $ = this


        if (!isInvokedByChildConstructor) {
            this.performSelfAnalysis()
        }
    }
}
