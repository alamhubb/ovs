import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts from "typescript";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";

export default class SourceElementsEs5Transformer {
    static transformSourceElements(sourceElementsAst: ChevrotainEcma5Ast) {
        const statement = sourceElementsAst.children[0]
        let childStatement = Es5Transformer.transform(statement)
        return {
            "kind": ts.SyntaxKind.Block,
            "statements": [childStatement]
        }
    }
}