import {OvsChevrotainSyntaxDefine} from "@/pluginOvs/chervotainSyntaxDefine/OvsChevrotainSyntaxDefine";
import {tokenize} from "@/pluginOvs/ecma5/ecma5_lexer";
import {convertCstToChevrotainAst, transformToAST} from "@/pluginOvs/parser/transformToAST";
import ChevrotainEcma5Ast from "@/pluginOvs/model/ChevrotainEcma5Ast";

export function ovsTypescriptParser(code) {

    const parserInstance = new OvsChevrotainSyntaxDefine();
    const tokens = tokenize(code);
    parserInstance.input = tokens;
// console.log(tokens)
    parserInstance.orgText = code;
    const res = parserInstance.Program();
    if (parserInstance.errors.length > 0) {
        console.log(parserInstance.errors)
        throw Error("Sad Sad Panda");
    }

    const chevrotainAst = convertCstToChevrotainAst(res)

    let res1

    res1 = {
        "kind": 307,
        "statements": [
            {
                "kind": 244,
                "expression": {
                    "kind": 213,
                    "expression": {
                        "kind": 80,
                        "escapedText": "h"
                    },
                    "arguments": [
                        {
                            "kind": 11,
                            "text": "div"
                        },
                        {
                            "kind": 9,
                            "text": "123",
                        }
                    ]
                }
            }
        ],
        "text": "",
        "fileName": "fsadfasd.ts",
    }
    res1 = transformToAST(chevrotainAst)

    console.log(JSON.stringify(res1))
    return res1
}

export function ovsChevrotainParser(): ChevrotainEcma5Ast {

}
