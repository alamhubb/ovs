import {ECMAScript5Parser, Es5SyntaxName} from "../../grammars/ecma5/ecma5_parser";
import * as t from "../../grammars/ecma5/ecma5_tokens";

export enum OvsSyntaxName {
    OvsDomRenderStatement = 'OvsDomRenderStatement',
}

export class OvsChevrotainSyntaxDefine extends ECMAScript5Parser {
    constructor() {
        super()
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
            $.CONSUME(t.Identifier);
            $.OPTION(() => {
                $.CONSUME(t.LParen);
                $.OPTION1(() => {
                    $.SUBRULE($.FormalParameterList);
                });
                $.CONSUME(t.RParen);
            });
            $.CONSUME(t.LCurly);
            $.OPTION2(() => {
                $.MANY(() => {
                    $.SUBRULE($.ElementList)
                });
                $.CONSUME(t.RCurly);
            });
        });

        this.performSelfAnalysis()
    }
}
