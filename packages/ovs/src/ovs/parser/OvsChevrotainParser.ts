import {ECMAScript5Parser, Es5SyntaxName} from "../../grammars/ecma5/ecma5_parser";
import {ECMAScript6Parser} from "../../grammars/es6/ECMAScript6Parser";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst.ts";
import ECMAScript6Lexer from "../../grammars/es6/ECMAScript6Lexer";
import * as es6AllTokens from "../../grammars/es6/ECMAScript6Token";
import * as t from "../../grammars/ecma5/ecma5_tokens";

export enum OvsSyntaxName {
    OvsRenderDomStatement = 'OvsRenderDomStatement',
}


// (	parentheses
// [	bracket
// {	brace ,curly brace ,curly bracket
export class OvsChevrotainParser extends ECMAScript5Parser {
    constructor() {
        super()
        const $ = this

        $.OVERRIDE_RULE(Es5SyntaxName.AssignmentExpression, () => {
            $.OR([
                {
                    ALT: () => {  $.SUBRULE($[OvsSyntaxName.OvsRenderDomStatement])}
                },
                {
                    ALT: () => {
                        $.SUBRULE($.BinaryExpression);
                        $.OPTION(() => {
                            $.CONSUME(t.Question);
                            $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
                            $.CONSUME(t.Colon);
                            $.SUBRULE2($[Es5SyntaxName.AssignmentExpression]);
                        });
                        return
                    },
                }
            ]);
        });

        $.RULE(OvsSyntaxName.OvsRenderDomStatement, () => {
            $.SUBRULE($.MemberCallNewExpression)
            $.CONSUME(es6AllTokens.LCurly);
            $.OPTION(() => {
                $.SUBRULE($[Es5SyntaxName.ElementList])
            });
            $.CONSUME(es6AllTokens.RCurly);
        });

        this.performSelfAnalysis()
    }
}

// (	parentheses
// [	bracket
// {	brace ,curly brace ,curly bracket

/**
 * Convert string code to ovs Chevrotain cst
 * @param code
 */
export function parseCodeToOvsCst(code: string): ChevrotainEcma5Cst {
    const parserInstance = new OvsChevrotainParser();
    // const tokens = ECMAScript6Lexer.tokenize(code);

    // console.log(tokens)

    // console.log(111)
    // parserInstance.input = tokens;
    // console.log(222)
    // parserInstance.orgText = code;
    // console.log(33)
    /*const cst = parserInstance.Program();
    console.log(44)
    if (parserInstance.errors.length > 0) {
        for (const error of parserInstance.errors) {
            console.log(error)
        }
        throw Error("ChevrotainCs parser code has error");
    }
    return cst*/
}
