import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts from "typescript";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";
import TransformerEs5 from "@/ovs/transform/transformEs5/TransformerEs5";

export default class SourceElementsEs5Transformer {
    static transformSourceElements(sourceElementsAst: ChevrotainEcma5Ast) {
        const statement = sourceElementsAst.children[0]
        let childStatement = TransformerEs5.transform(statement)
        return {
            "kind": ts.SyntaxKind.Block,
            "statements": [childStatement]
        }
    }
}