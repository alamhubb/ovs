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
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import ObjectLiteralEs5Transformer from "@/ovs/transform/transformEs5/ObjectLiteralEs5Transformer";

export const ovsToTsTokenEs5SyntaxMap: Map<string, number> = new Map()
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.NumericLiteral, ts.SyntaxKind.NumericLiteral)
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.Identifier, ts.SyntaxKind.Identifier)
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.DefaultTok, ts.SyntaxKind.DefaultKeyword)


export default class VariableStatementOvsChevrotainEs5Transformer {
    static transformVariableStatementAst(syntax: ChevrotainEcma5Ast) {
        let astKind
        let declarationList
        let declarations: TypescriptAstNode<DeclarationsExtendNode> [] = [];
        for (const tokenSyntax of syntax.children) {
            //support var const
            if ([Es5TokenName.VarTok, ES6TokenName.ConstTok].includes(tokenSyntax.name)) {
                astKind = ts.SyntaxKind.VariableStatement
            } else if (tokenSyntax.name === Es5SyntaxName.VariableDeclarationList) {
                //对应一条声明语句 variableDeclarationCst ,遍历 VariableDeclarationList
                for (const variableDeclarationCst of tokenSyntax.children) {
                    // 遍历 VariableDeclaration
                    if (variableDeclarationCst.name === Es5SyntaxName.VariableDeclaration) {
                        let name: TypescriptAstNode<TypescriptTextExtendAstNode> = null
                        let initializer: TypescriptAstNode<TypescriptTextExtendAstNode> = null
                        for (const variableDeclarationTokenSyntax of variableDeclarationCst.children) {
                            if (variableDeclarationTokenSyntax.name === Es5TokenName.Identifier) {
                                name = {
                                    kind: ovsToTsTokenEs5SyntaxMap.get(variableDeclarationTokenSyntax.name),
                                    escapedText: variableDeclarationTokenSyntax.image
                                }
                                // 9 = NumericLiteral
                            } else if (variableDeclarationTokenSyntax.name === Es5SyntaxName.Initialiser) {
                                const assignmentExpressionCst = variableDeclarationTokenSyntax.children[1]
                                initializer = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(assignmentExpressionCst)

                                console.log(33333)
                                console.log(initializer)
                            }
                        }
                        const declaration: TypescriptAstNode<DeclarationsExtendNode> = {
                            kind: ts.SyntaxKind.VariableDeclaration,
                            name,
                            initializer
                        }
                        declarations.push(declaration)
                    }
                }
            }
        }

        if (!astKind) {
            throw new Error(`错误的Kind:${syntax.name}:${syntax.name}:${syntax.image}`)
        }

        if (!declarations.length) {
            throw new Error('错误的' + Es5SyntaxName.VariableDeclarationList)
        }

        let ast: TypescriptAstNode<StatementExtendNode> = {
            kind: astKind,
            declarationList: {
                kind: ts.SyntaxKind.VariableDeclarationList,
                declarations: declarations
            }
        }
        return ast
    }

    static getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression: ChevrotainEcma5Ast): TypescriptAstNode<TypescriptTextExtendAstNode> {
        //assignmentExpression.BinaryExpression. UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression.child[0]
        console.log(assignmentExpression)
        console.log(assignmentExpression.children[0])
        const primaryExpression = assignmentExpression.children[0].children[0].children[0].children[0].children[0];
        return VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByPrimaryExpression(primaryExpression)
    }

    static getPrimaryExpressionTokenByPrimaryExpression(primaryExpression: ChevrotainEcma5Ast): TypescriptAstNode<TypescriptTextExtendAstNode> {
        //assignmentExpression.BinaryExpression. UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression.child[0]
        const primaryExpressionToken = primaryExpression.children[0];
        if (primaryExpressionToken.name === Es5TokenName.Identifier) {
            return {
                kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.name),
                escapedText: primaryExpressionToken.image
            }
        } else if (primaryExpressionToken.name === Es5TokenName.NumericLiteral) {
            return {
                kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.name),
                text: String(primaryExpressionToken.image)
            }
        } else if (primaryExpressionToken.name === Es5SyntaxName.ObjectLiteral) {
            return ObjectLiteralEs5Transformer.transformObjectLiteralAst(primaryExpressionToken)
        } else {
            console.warn(`unexpected tokenTypeName:${primaryExpressionToken.name}:${primaryExpressionToken.name}`)
            return {
                kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.name),
                //这里应该为 text，todo 待确认
                escapedText: primaryExpressionToken.image
            }
        }
    }
}

