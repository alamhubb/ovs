import {Es5SyntaxName} from "../../grammars/ecma5/ecma5_parser";
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
export class OvsChevrotainParser extends ECMAScript6Parser {
    constructor() {
        super(true)
        const $ = this

        /*const StatementValue = [
            {ALT: () => $.SUBRULE($[OvsSyntaxName.OvsRenderDomStatement])},
            ...$.StatementValue
        ]*/

        $.OVERRIDE_RULE(Es5SyntaxName.AssignmentExpression, () => {
            console.log(11111)
            $.OR([
                // { ALT: () => $.CONSUME(es6AllTokens.LetTok) },
                {
                    ALT: () => {
                        console.log('chufale111111')
                        return $.SUBRULE($[OvsSyntaxName.OvsRenderDomStatement])
                    }
                },
                {
                    ALT: () => {
                        console.log('chufale222222')
                        return $.SUBRULE($.BinaryExpression)
                    }
                }
            ]);
            $.OPTION(() => {
                $.CONSUME(t.Question);
                $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
                $.CONSUME(t.Colon);
                $.SUBRULE2($[Es5SyntaxName.AssignmentExpression]);
            });
        });

        $.RULE(OvsSyntaxName.OvsRenderDomStatement, () => {
            console.log('1111')
            $.CONSUME(es6AllTokens.Identifier);
            console.log('222')
            $.OPTION(() => {
                $.SUBRULE($.Arguments)
            });
            console.log('333')
            $.CONSUME(es6AllTokens.LCurly);
            console.log('4444')
            // $.SUBRULE($[Es5SyntaxName.ElementList])
            /*$.MANY(() => {
                $.OR([
                    {ALT: () => $.SUBRULE($[Es5SyntaxName.ElementList])},
                    {ALT: () => $.SUBRULE($.Elision)},
                ]);
            });*/
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
        for (const error of parserInstance.errors) {
            console.log(error)
        }
        throw Error("ChevrotainCs parser code has error");
    }
    return cst
}
