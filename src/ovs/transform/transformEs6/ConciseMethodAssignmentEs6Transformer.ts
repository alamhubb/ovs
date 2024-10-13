import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts from "typescript";
import {Es5SyntaxName} from "@/grammars/ecma5/Es5Parser";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import {Es5TokenName} from "@/grammars/ecma5/ecma5_tokens";
import SourceElementsEs5Transformer from "@/ovs/transform/transformEs5/SourceElementsEs5Transformer";

export default class ConciseMethodAssignmentEs6Transformer {
    static transformEs6ConciseMethodAssignment(conciseMethodAssignmentAst: ChevrotainEcma5Ast) {
        let nameKind
        let body
        const conciseMethodAssignmentAstChildren = conciseMethodAssignmentAst.children
        for (const conciseMethodAssignmentAstChild of conciseMethodAssignmentAstChildren) {
            if (conciseMethodAssignmentAstChild.name === Es5SyntaxName.PropertyName) {
                nameKind = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByPrimaryExpression(conciseMethodAssignmentAstChild)
            } else if (conciseMethodAssignmentAstChild.name === Es5SyntaxName.SourceElements) {
                body = SourceElementsEs5Transformer.transformSourceElements(conciseMethodAssignmentAstChild)
            }
        }
        console.log(77777)
        return {
            kind: ts.SyntaxKind.MethodDeclaration, //174
            name: nameKind,
            "parameters": [],
            "body": body
        }
    }
}