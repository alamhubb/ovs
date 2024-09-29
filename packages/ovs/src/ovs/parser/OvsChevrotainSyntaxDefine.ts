import {Es5SyntaxName} from "../../grammars/ecma5/ecma5_parser";
import {ECMAScript6Parser} from "../../grammars/es6/ECMAScript6Parser";
import * as es6AllTokens from "../../grammars/es6/ECMAScript6Token";

export enum OvsSyntaxName {
    OvsDomRenderStatement = 'OvsDomRenderStatement',
}

export class OvsChevrotainSyntaxDefine extends ECMAScript6Parser {

    constructor() {
        super(true)
        const $ = this

        const StatementValue = [
            {ALT: () => $.SUBRULE($[OvsSyntaxName.OvsDomRenderStatement])},
            ...$.StatementValue
        ]

        $.OVERRIDE_RULE(Es5SyntaxName.Statement, () => {
            $.OR(StatementValue);
        });


        $.RULE(OvsSyntaxName.OvsDomRenderStatement, () => {
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
