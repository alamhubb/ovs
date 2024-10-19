import Es6Parser from "subhuti/syntax/es6/Es6Parser.js";
import {SubhutiRule} from "subhuti/SubhutiParser.js";
import {es6TokensObj} from "subhuti/syntax/es6/Es6Tokens.js";

export default class OvsParser extends Es6Parser {
    @SubhutiRule
    OvsRenderDom() {
        this.Option(() => {
            this.consume(es6TokensObj.IdentifierName)
        })
        this.Option(() => {
            this.Option(() => {
                this.Arguments()
            })
            this.tokenConsumer.Colon();
            this.Option(() => {
                this.consume(es6TokensObj.IdentifierName)
            })
        })
        this.Option(() => {
            this.Arguments()
        })
        this.consume(es6TokensObj.LBrace)
        this.Option(() => {
            this.ElementList()
        })
        this.consume(es6TokensObj.RBrace)
        console.log(11111)
        return this.getCurCst()
    }


    @SubhutiRule
    AssignmentExpression() {
        this.Or([
            {alt: () => this.OvsRenderDom()},
            {
                alt: () => {
                    this.ConditionalExpression()
                }
            },
            {
                alt: () => {
                    this.YieldExpression();
                }
            },
            {alt: () => this.ArrowFunction()},
            {
                alt: () => {
                    this.LeftHandSideExpression();
                    this.tokenConsumer.Eq();
                    this.AssignmentExpression();
                }
            },
            {
                alt: () => {
                    this.LeftHandSideExpression();
                    this.AssignmentOperator();
                    this.AssignmentExpression();
                }
            }
        ]);
    }
}
