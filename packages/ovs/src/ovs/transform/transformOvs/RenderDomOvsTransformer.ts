import {OvsSyntaxName} from "../../parser/OvsChevrotainParser.ts";
import ChevrotainEcma5Cst from "../../model/ChevrotainEcma5Cst.ts";
import ts, {SourceFile, Statement} from "typescript";
import {Es5SyntaxName} from "../../../grammars/ecma5/ecma5_parser.ts";
import ChevrotainEcma5Ast from "../../model/ChevrotainEcma5Ast.ts";
import {
    ArgumentsExtendNode,
    DeclarationsExtendNode,
    StatementExtendNode,
    TypescriptAstNode, TypescriptTextExtendAstNode
} from "../../TypescriptAstNode.ts";
import {Es5TokenName} from "../../../grammars/ecma5/ecma5_tokens.ts";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";

const ovsToTsTokenEs5SyntaxMap: Map<string, number> = new Map()
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.NumericLiteral, ts.SyntaxKind.NumericLiteral)
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.Identifier, ts.SyntaxKind.Identifier)


export default class RenderDomOvsTransformer {
    static transformOvsRenderDomAst(syntax: ChevrotainEcma5Ast) {
        const argumentsAry: TypescriptAstNode<ArgumentsExtendNode>[] = []
        let ast: TypescriptAstNode<StatementExtendNode> = {
            kind: ts.SyntaxKind.CallExpression,
            expression: {
                kind: ts.SyntaxKind.Identifier,
                escapedText: "h",
            },
            arguments: argumentsAry
        }
        for (const syntaxToken of syntax.children) {
            if (syntaxToken.tokenTypeName === Es5TokenName.Identifier) {
                //tagName 固定为 StringLiteral
                const argument: TypescriptAstNode<ArgumentsExtendNode> = {
                    // pos: syntaxToken.startOffset,
                    // end: syntaxToken.endOffset,
                    kind: ts.SyntaxKind.StringLiteral,
                    text: syntaxToken?.image,
                }
                argumentsAry.push(argument)
            } else if (syntaxToken.name === Es5SyntaxName.ElementList) {
                function assignmentExpressionGetToken(assignmentExpression: ChevrotainEcma5Ast) {

                    const token = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression)

                    return token
                }

                let child
                if (syntaxToken.children.length > 1) {
                    const elements = []
                    child = {
                        kind: ts.SyntaxKind.ArrayLiteralExpression,
                        elements: elements
                    }
                    for (const assignmentExpression of syntaxToken.children) {
                        elements.push(assignmentExpressionGetToken(assignmentExpression))
                    }
                } else {
                    const assignmentExpression = syntaxToken.children[0]
                    child = assignmentExpressionGetToken(assignmentExpression)
                }
                if (!argumentsAry.length) {
                    throw "renderDom syntax error"
                }
                argumentsAry.push(child)
            }
        }
        return ast;
    }
}
