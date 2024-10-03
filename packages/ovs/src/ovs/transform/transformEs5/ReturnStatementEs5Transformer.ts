import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts from "typescript";
import {Es5TokenName} from "@/grammars/ecma5/ecma5_tokens";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";

export default class ReturnStatementEs5Transformer {
    static transformEs5ReturnStatement(returnStatement: ChevrotainEcma5Ast) {
        const returnChildren = returnStatement.children
        let returnKind
        let expression
        for (const returnChild of returnChildren) {
            if (returnChild.tokenTypeName === Es5TokenName.ReturnTok) {
                returnKind = ts.SyntaxKind.ReturnStatement
            } else if (statementChild.name === Es5SyntaxName.Expression) {
                expression = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(statementChild.children[0])
            } else {
                throw new Error('未知类型' + statement.name)
            }
        }
        return {
            kind: returnKind,
            expression: expression
        }
    }
}