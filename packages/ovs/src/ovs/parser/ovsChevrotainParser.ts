import {tokenize} from "../../grammars/ecma5/ecma5_lexer.ts";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst.ts";
import {OvsChevrotainSyntaxDefine} from "./OvsChevrotainSyntaxDefine.ts";
import ECMAScript6Lexer from "@/grammars/es6/ECMAScript6Lexer";

/**
 * Convert string code to ovs Chevrotain cst
 * @param code
 */
export function parseToOvsChevrotainCst(code: string): ChevrotainEcma5Cst {
    const parserInstance = new OvsChevrotainSyntaxDefine();
    const tokens = ECMAScript6Lexer.tokenize(code);
    parserInstance.input = tokens;
    parserInstance.orgText = code;
    const cst = parserInstance.Program();
    if (parserInstance.errors.length > 0) {
        console.log(parserInstance.errors)
        throw Error("Sad Sad Panda");
    }
    return cst
}
