import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";
import ProgramEs5Transformer from "@/ovs/transform/transformEs5/ProgramEs5Transformer";
import SourceElementsEs5Transformer from "@/ovs/transform/transformEs5/SourceElementsEs5Transformer";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";
import TransformerEs5 from "@/ovs/transform/transformEs5/TransformerEs5";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import ExportDefaultStatementEs6Transformer from "@/ovs/transform/transformEs6/ExportDefaultStatementEs6Transformer";
import {Doko} from "@/doko/doko";

@Doko(TransformerEs5)
export default class TransformerEs6 {
    static transform(node: ChevrotainEcma5Ast) {
        let result
        switch (node.name) {
            case Es6SyntaxName.ExportDefaultStatement:
                result = ExportDefaultStatementEs6Transformer.transformExportDefaultStatement(node);
            case Es6SyntaxName.ClassDeclaration:
                return this.transformClassDeclaration(node as SourceNode);
            case "ClassBody":
                return this.transformClassBody(node as SourceNode);
            case "ClassElement":
                return this.transformClassElement(node as SourceNode);
            case "MethodDefinition":
                return this.transformMethodDefinition(node as SourceNode);
        }
        if (!result) {
            result = TransformerEs5.transform(node)
        }
        return result;
    }
}