import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts from "typescript";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";

export default class SourceElementsEs5Transformer {
    static transformEs5SourceElements(sourceElementsAst: ChevrotainEcma5Ast) {
        const statement = sourceElementsAst.children[0]
        let childStatement = StatementEs5Transformer.transformStatementAst(statement)
        return {
            "kind": ts.SyntaxKind.Block,
            "statements": [childStatement]
        }
    }
}