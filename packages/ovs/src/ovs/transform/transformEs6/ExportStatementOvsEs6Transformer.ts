import {OvsSyntaxName} from "../../parser/OvsChevrotainParser.ts"
import ChevrotainEcma5Cst from "../../model/ChevrotainEcma5Cst.ts"
import ts, {SourceFile, Statement} from "typescript"
import {Es5SyntaxName} from "../../../grammars/ecma5/Es5Parser.ts"
import ChevrotainEcma5Ast from "../../model/ChevrotainEcma5Ast.ts"
import {
    ArgumentsExtendNode,
    DeclarationsExtendNode,
    StatementExtendNode,
    TypescriptAstNode, TypescriptTextExtendAstNode
} from "../../TypescriptAstNode.ts"
import {Es5TokenName} from "../../../grammars/ecma5/ecma5_tokens.ts"
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token"
import {Es6SyntaxName} from "@/grammars/es6/Es6Parser"
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer"
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer"


export default class ExportStatementOvsEs6Transformer {
    static transformExportStatementAst(syntax: ChevrotainEcma5Ast) {
        let astKind
        let variableStatement
        for (const tokenSyntax of syntax.children) {
            if ([ES6TokenName.ExportTok].includes(tokenSyntax.name)) {
                astKind = ts.SyntaxKind.ExportKeyword
            } else if (tokenSyntax.name === Es5SyntaxName.VariableStatement) {
                variableStatement = VariableStatementOvsChevrotainEs5Transformer.transformVariableStatementAst(tokenSyntax)
            }
        }

        if (!astKind) {
            throw new Error(`错误的Kind:${syntax.name}:${syntax.name}:${syntax.image}`)
        }

        if (!variableStatement) {
            throw new Error('错误的' + Es5SyntaxName.VariableStatement)
        }


        return {
            ...variableStatement,
            modifiers: [{
                kind: astKind
            }],
        }
    }


    static transformDefaultExportStatementAst(syntax: ChevrotainEcma5Ast) {
        let astKind
        let expression
        console.log(6666)
        for (const tokenSyntax of syntax.children) {

            if (Es6SyntaxName.ClassDeclaration === tokenSyntax.name) {

            } else {
                console.log(tokenSyntax.name)
                console.log(tokenSyntax.name)
                if ([Es5TokenName.DefaultTok].includes(tokenSyntax.name)) {
                    console.log(5555)
                    //277
                    astKind = ts.SyntaxKind.ExportAssignment
                } else if (tokenSyntax.name === Es5SyntaxName.AssignmentExpression) {
                    console.log(4444)
                    expression = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(tokenSyntax)
                } else if ([ES6TokenName.ExportTok].includes(tokenSyntax.name)) {
                    // console.log(tokenSyntax.name)
                } else {
                    // throw new Error(JSON.stringify(tokenSyntax))
                }
                if (!astKind) {
                    throw new Error(`错误的Kind:${syntax.name}:${syntax.name}:${syntax.image}`)
                }

                if (!expression) {
                    throw new Error('错误的' + Es5SyntaxName.AssignmentExpression)
                }

                return {
                    kind: astKind,
                    expression: expression
                }
            }
        }
    }
}

