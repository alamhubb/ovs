/**
 * ECMAScript cannot be easily lexed using a distinct lexing phase.
 * See: https://users.soe.ucsc.edu/~cormac/papers/dls14a.pdf
 *
 * So to expedite the creation of the chevrotain ECMA5 grammar.
 * The Acorn project was used to (only) tokenize the input text
 *
 * In the future this should be refactored to avoid the distinct lexing phase based on:
 * https://github.com/chevrotain/chevrotain/blob/master/test/full_flow/ecma_quirks/ecma_quirks.ts
 *
 */
import * as acorn from "acorn";

const acornTokTypes = acorn.tokTypes;
//将token对象和token符号对应上
import * as tokens from "./ECMAScript6Token.ts";
import {createChevToken, getEs5ChevrotainToken} from "@/grammars/ecma5/ecma5_lexer";
import {Token} from "acorn";


function getEs6PreToken(acornType: String, token: Token) {
    let ctt
    switch (acornType) {
        case acornTokTypes._const:
            ctt = tokens.ConstTok;
            break;
        case acornTokTypes._class:
            ctt = tokens.ClassTok;
            break;
        case acornTokTypes.name:
            switch (token.value) {
                case "static":
                    console.log(token.value)
                    ctt = tokens.StaticTok;
                    break;
                default:
                    break;
            }
            break;
        case acornTokTypes._extends:
            ctt = tokens.ExtendsTok;
            break;
        case acornTokTypes._export:
            ctt = tokens.ExportTok;
            break;
        case acornTokTypes._import:
            ctt = tokens.ImportTok;
            break;
        case acornTokTypes.arrow:
            ctt = tokens.Arrow;
            break;
        case acornTokTypes.ellipsis:
            ctt = tokens.Ellipsis;
            break;
        case acornTokTypes.backQuote:
            ctt = tokens.BackQuote;
            break;
        case acornTokTypes.dollarBraceL:
            ctt = tokens.DollarCurly;
            break;
        default:
            break
    }
    return ctt
}

export function getEs6ChevrotainToken(acornType: String, token: Token) {
    let ctt = getEs6PreToken(acornType, token)
    if (!ctt) {
        ctt = getEs5ChevrotainToken(acornType, token)
    }
    return ctt
}


export default class ECMAScript6Lexer {
    static tokenize(str) {
        const result = [];
        const tokens = []
        for (let token of acorn.tokenizer(str, {ecmaVersion: 6})) {
            tokens.push(token)
            let acornType = token.type;
            let ctt = getEs6ChevrotainToken(acornType, token)
            if (!ctt) {
                throw Error("Unknown es6 token:" + acornType);
            }
            const chevToken = createChevToken(ctt, token);
            result.push(chevToken);
        }
        // console.log(tokens)
        return result;
    }
}
