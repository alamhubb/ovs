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

        $.OVERRIDE_RULE("Statement", () => {
            $.OR([
                    {ALT: () => $.SUBRULE($[OvsSyntaxName.OvsDomRenderStatement])},
                    {ALT: () => $.SUBRULE($.Block)},
                    {ALT: () => $.SUBRULE($[Es5SyntaxName.VariableStatement])},
                    {ALT: () => $.SUBRULE($.EmptyStatement)},
                    // "LabelledStatement" must appear before "ExpressionStatement" due to common lookahead prefix ("inner :" vs "inner")
                    {ALT: () => $.SUBRULE($.LabelledStatement)},
                    // The ambiguity is resolved by the ordering of the alternatives
                    // See: https://ecma-international.org/ecma-262/5.1/#sec-12.4
                    //   - [lookahead ∉ {{, function}]
                    {
                        ALT: () => $.SUBRULE($.ExpressionStatement),
                        IGNORE_AMBIGUITIES: true,
                    },
                    {ALT: () => $.SUBRULE($.IfStatement)},
                    {ALT: () => $.SUBRULE($.IterationStatement)},
                    {ALT: () => $.SUBRULE($.ContinueStatement)},
                    {ALT: () => $.SUBRULE($.BreakStatement)},
                    {ALT: () => $.SUBRULE($.ReturnStatement)},
                    {ALT: () => $.SUBRULE($.WithStatement)},
                    {ALT: () => $.SUBRULE($.SwitchStatement)},
                    {ALT: () => $.SUBRULE($.ThrowStatement)},
                    {ALT: () => $.SUBRULE($.TryStatement)},
                    {ALT: () => $.SUBRULE($.DebuggerStatement)},
                ]
            );
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
