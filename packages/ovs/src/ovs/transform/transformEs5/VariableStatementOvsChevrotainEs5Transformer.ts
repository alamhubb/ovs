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
import {ECMAScript6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";

const ovsToTsTokenEs5SyntaxMap: Map<string, number> = new Map()
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.NumericLiteral, ts.SyntaxKind.NumericLiteral)
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.Identifier, ts.SyntaxKind.Identifier)


export default class VariableStatementOvsChevrotainEs5Transformer {
    static transformVariableStatementAst(syntax: ChevrotainEcma5Ast) {
        let astKind
        let declarationList
        let declarations: TypescriptAstNode<DeclarationsExtendNode> [] = [];
        for (const tokenSyntax of syntax.children) {
            //support var const
            if ([Es5TokenName.VarTok, ECMAScript6TokenName.ConstTok].includes(tokenSyntax.tokenTypeName)) {
                astKind = ts.SyntaxKind.VariableStatement
            } else if (tokenSyntax.name === Es5SyntaxName.VariableDeclarationList) {
                //对应一条声明语句 variableDeclarationCst ,遍历 VariableDeclarationList
                for (const variableDeclarationCst of tokenSyntax.children) {
                    // 遍历 VariableDeclaration
                    if (variableDeclarationCst.name === Es5SyntaxName.VariableDeclaration) {
                        let name: TypescriptAstNode<TypescriptTextExtendAstNode> = null
                        let initializer: TypescriptAstNode<TypescriptTextExtendAstNode> = null
                        for (const variableDeclarationTokenSyntax of variableDeclarationCst.children) {
                            if (variableDeclarationTokenSyntax.tokenTypeName === Es5TokenName.Identifier) {
                                name = {
                                    kind: ovsToTsTokenEs5SyntaxMap.get(variableDeclarationTokenSyntax.tokenTypeName),
                                    escapedText: variableDeclarationTokenSyntax.image
                                }
                                // 9 = NumericLiteral
                            } else if (variableDeclarationTokenSyntax.name === Es5SyntaxName.Initialiser) {
                                //AssignmentExpression.BinaryExpression.UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression
                                const assignmentExpressionCst = variableDeclarationTokenSyntax.children[1]
                                initializer = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(assignmentExpressionCst)
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
            throw new Error(`错误的Kind:${syntax.name}:${syntax.tokenTypeName}:${syntax.image}`)
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
        const primaryExpressionToken = assignmentExpression.children[0].children[0].children[0].children[0].children[0].children[0];

        if (primaryExpressionToken.tokenTypeName === Es5TokenName.Identifier) {
            return {
                kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
                escapedText: primaryExpressionToken.image
            }
        } else if (primaryExpressionToken.tokenTypeName === Es5TokenName.NumericLiteral) {
            return {
                kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
                escapedText: String(primaryExpressionToken.image)
            }
        } else {
            console.warn(`unexpected tokenTypeName:${primaryExpressionToken.tokenTypeName}:${primaryExpressionToken.image}`)
            return {
                kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
                text: primaryExpressionToken.image
            }
        }
    }
}

