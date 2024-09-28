import {tokenize} from "../ecma5/ecma5_lexer.ts";
import {convertCstToChevrotainAst, transformToAST} from "../transformToAST.ts";
import {code} from "./code.ts";
import {OvsParser} from "../OvsParser.ts";


const res1 = getChevrotainToTsAst(code)



export function getChevrotainToTsAst(code) {

    const parserInstance = new OvsParser();
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


