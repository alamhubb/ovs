import {tokenize} from "../ecma5/ecma5_lexer.ts";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst.ts";
import {OvsChevrotainSyntaxDefine} from "./OvsChevrotainSyntaxDefine.ts";

/**
 * Convert string code to ovs Chevrotain cst
 * @param code
 */
export function parseToOvsChevrotainCst(code: string): ChevrotainEcma5Cst {
    const parserInstance = new OvsChevrotainSyntaxDefine();
    const tokens = tokenize(code);
    parserInstance.input = tokens;
    parserInstance.orgText = code;
    const cst = parserInstance.Program();
    if (parserInstance.errors.length > 0) {
        console.log(parserInstance.errors)
        throw Error("Sad Sad Panda");
    }
    return cst
}
