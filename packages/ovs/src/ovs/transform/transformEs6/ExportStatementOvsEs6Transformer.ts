import { OvsSyntaxName } from "../../parser/OvsChevrotainParser.ts"
import ChevrotainEcma5Cst from "../../model/ChevrotainEcma5Cst.ts"
import ts, { SourceFile, Statement } from "typescript"
import { Es5SyntaxName } from "../../../grammars/ecma5/ecma5_parser.ts"
import ChevrotainEcma5Ast from "../../model/ChevrotainEcma5Ast.ts"
import {
  ArgumentsExtendNode,
  DeclarationsExtendNode,
  StatementExtendNode,
  TypescriptAstNode, TypescriptTextExtendAstNode
} from "../../TypescriptAstNode.ts"
import { Es5TokenName } from "../../../grammars/ecma5/ecma5_tokens.ts"
import { ES6TokenName } from "@/grammars/es6/ECMAScript6Token"
import { Es6SyntaxName } from "@/grammars/es6/ECMAScript6Parser"
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer"
import VariableStatementOvsChevrotainEs5Transformer
  from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer"

const ovsToTsTokenEs5SyntaxMap: Map<string, number> = new Map()
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.NumericLiteral, ts.SyntaxKind.NumericLiteral)
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.Identifier, ts.SyntaxKind.Identifier)


export default class ExportStatementOvsEs6Transformer {
  static transformExportStatementAst(syntax: ChevrotainEcma5Ast) {
    let astKind
    let variableStatement
    for (const tokenSyntax of syntax.children) {
      if ([ES6TokenName.ExportTok].includes(tokenSyntax.tokenTypeName)) {
        astKind = ts.SyntaxKind.ExportKeyword
      } else if (tokenSyntax.name === Es5SyntaxName.VariableStatement) {
        variableStatement = VariableStatementOvsChevrotainEs5Transformer.transformVariableStatementAst(tokenSyntax)
      }
    }

    if (!astKind) {
      throw new Error(`错误的Kind:${syntax.name}:${syntax.tokenTypeName}:${syntax.image}`)
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
    for (const tokenSyntax of syntax.children) {
      if ([Es5TokenName.DefaultTok].includes(tokenSyntax.tokenTypeName)) {
        astKind = ts.SyntaxKind.ExportAssignment
      } else if (tokenSyntax.name === Es5SyntaxName.AssignmentExpression) {
        expression = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(tokenSyntax)
      } else if ([ES6TokenName.ExportTok].includes(tokenSyntax.tokenTypeName)) {
        console.log(tokenSyntax.tokenTypeName)
      } else {
        throw new Error(JSON.stringify(tokenSyntax))
      }
    }

    if (!astKind) {
      throw new Error(`错误的Kind:${syntax.name}:${syntax.tokenTypeName}:${syntax.image}`)
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

