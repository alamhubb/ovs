import {ECMAScript5Parser} from "./ecma5/ecma5_parser.js";
import * as t from "./ecma5/ecma5_tokens.js";

export enum OvsSyntaxName {
    OvsDomRenderStatement = 'OvsDomRenderStatement',
}

export class OvsParser extends ECMAScript5Parser {
    constructor() {
        super()
        const $ = this
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
        $.c2.unshift({
            ALT: () => {
                return $.SUBRULE($[OvsSyntaxName.OvsDomRenderStatement])
            }
        })
        this.performSelfAnalysis()
    }
}
