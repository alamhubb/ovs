import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst.ts";
import {OvsChevrotainSyntaxDefine} from "./OvsChevrotainSyntaxDefine.ts";
import ECMAScript6Lexer from "../../grammars/es6/ECMAScript6Lexer";
import * as es6AllTokens from "../../grammars/es6/ECMAScript6Token";
import type {IToken} from "@chevrotain/types";

export const tokenIndexMap: Map<number, string> = Object.values(es6AllTokens).reduce((map, item: IToken) => {
    // 将对象的 typeIndex 作为 key，值为对象本身
    map.set(item.tokenTypeIdx, item.name);
    return map;
}, new Map());

/**
 * Convert string code to ovs Chevrotain cst
 * @param code
 */
export function parseToOvsChevrotainCst(code: string): ChevrotainEcma5Cst {
    const parserInstance = new OvsChevrotainSyntaxDefine();
    const tokens = ECMAScript6Lexer.tokenize(code);

    console.log(tokens)

    console.log(111)
    parserInstance.input = tokens;
    console.log(222)
    parserInstance.orgText = code;
    console.log(33)
    const cst = parserInstance.Program();
    console.log(44)
    if (parserInstance.errors.length > 0) {
        console.log(parserInstance.errors)
        throw Error("ChevrotainCs parser code has error");
    }
    return cst
}
