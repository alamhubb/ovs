import {OvsSyntaxName} from "../../parser/OvsChevrotainSyntaxDefine.ts";
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
import {tokenIndexMap} from "../../parser/ovsChevrotainParser";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";


export default class OvsChevrotainEs5StatementTransformer {
    static transformStatementAst(parentStatementAst: ChevrotainEcma5Ast): Statement {
        let ast: TypescriptAstNode<StatementExtendNode> = {}
        const statementAst = parentStatementAst.children[0]
        if (statementAst.name === OvsSyntaxName.OvsDomRenderStatement) {
            ast = OvsChevrotainEs5StatementTransformer.transformOvsRenderDomAst(statementAst);
        } else if (statementAst.name === Es6SyntaxName.ExportStatement) {
            ast = OvsChevrotainEs5StatementTransformer.transformVariableStatementAst(statementAst);
        } else if (statementAst.name === Es5SyntaxName.VariableStatement) {
            ast = OvsChevrotainEs5StatementTransformer.transformVariableStatementAst(statementAst);
        } else {
            throw `unknown Statement：${statementAst.name}`
        }
        return ast
    }


    static transformOvsRenderDomAst(syntax: ChevrotainEcma5Ast) {
        const argumentsAry: TypescriptAstNode<ArgumentsExtendNode>[] = []
        let ast: TypescriptAstNode<StatementExtendNode> = {
            kind: ts.SyntaxKind.ExpressionStatement,
            expression: {
                kind: ts.SyntaxKind.CallExpression,
                expression: {
                    kind: ts.SyntaxKind.Identifier,
                    escapedText: "h",
                },
                arguments: argumentsAry
            }
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
                    //assignmentExpression.BinaryExpression. UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression.tokenType
                    const token = getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression)

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
                                initializer = getPrimaryExpressionTokenByAssignmentExpression(assignmentExpressionCst)
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
            throw `错误的Kind:${syntax.name}:${syntax.tokenTypeName}:${syntax.image}`
        }

        if (!declarations.length) {
            throw '错误的' + Es5SyntaxName.VariableDeclarationList
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
}


function getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression: ChevrotainEcma5Ast): TypescriptAstNode<TypescriptTextExtendAstNode> {
    const primaryExpressionToken = assignmentExpression.children[0].children[0].children[0].children[0].children[0].children[0];

    if (primaryExpressionToken.tokenTypeName === Es5TokenName.Identifier) {
        return {
            kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
            escapedText: primaryExpressionToken.image
        }
    } else {
        return {
            kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
            text: String(primaryExpressionToken.image)
        }
    }
}
