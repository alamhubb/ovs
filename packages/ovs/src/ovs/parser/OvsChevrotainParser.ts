import {Es5SyntaxName} from "../../grammars/ecma5/ecma5_parser";
import {ECMAScript6Parser} from "../../grammars/es6/ECMAScript6Parser";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst.ts";
import ECMAScript6Lexer from "../../grammars/es6/ECMAScript6Lexer";
import * as es6AllTokens from "../../grammars/es6/ECMAScript6Token";

export enum OvsSyntaxName {
    OvsRenderDomStatement = 'OvsRenderDomStatement',
}

export class OvsChevrotainParser extends ECMAScript6Parser {
    constructor() {
        super(true)
        const $ = this

        const StatementValue = [
            {ALT: () => $.SUBRULE($[OvsSyntaxName.OvsRenderDomStatement])},
            ...$.StatementValue
        ]

        $.OVERRIDE_RULE(Es5SyntaxName.Statement, () => {
            $.OR(StatementValue);
        });


        $.RULE(OvsSyntaxName.OvsRenderDomStatement, () => {
            $.CONSUME(es6AllTokens.Identifier);
            $.OPTION(() => {
                $.CONSUME(es6AllTokens.LParen);
                $.OPTION1(() => {
                    $.SUBRULE($.FormalParameterList);
                });
                $.CONSUME(es6AllTokens.RParen);
            });
            $.CONSUME(es6AllTokens.LCurly);
            $.OPTION2(() => {
                $.MANY(() => {
                    $.SUBRULE($.ElementList)
                });
                $.CONSUME(es6AllTokens.RCurly);
            });
        });

        this.performSelfAnalysis()
    }
}

/**
 * Convert string code to ovs Chevrotain cst
 * @param code
 */
export function parseCodeToOvsCst(code: string): ChevrotainEcma5Cst {
    const parserInstance = new OvsChevrotainParser();
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
