import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";
import ProgramEs5Transformer from "@/ovs/transform/transformEs5/ProgramEs5Transformer";
import SourceElementsEs5Transformer from "@/ovs/transform/transformEs5/SourceElementsEs5Transformer";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import ExportDefaultStatementEs6Transformer from "@/ovs/transform/transformEs6/ExportDefaultStatementEs6Transformer";
import {Doko} from "@/doko/doko";
import ClassDeclarationEs6Transformer from "@/ovs/transform/transformEs6/ClassDeclarationEs6Transformer";
import ClassBodyTransformer from "@/ovs/transform/transformEs6/ClassBodyTransformer";
import ClassElementTransformer from "@/ovs/transform/transformEs6/ClassElementTransformer";
import MethodDeclarationTransformerEs6 from "@/ovs/transform/transformEs6/MethodDeclarationTransformerEs6";

@Doko(Es5Transformer)
export default class Es6Transformer {
    static transform(node: ChevrotainEcma5Ast) {
        let result
        switch (node.name) {
            case Es6SyntaxName.ExportDefaultStatement:
                result = ExportDefaultStatementEs6Transformer.transformExportDefaultStatement(node);
            case Es6SyntaxName.ClassDeclaration:
                return ClassDeclarationEs6Transformer.transformClassDeclaration(node);
            case Es6SyntaxName.ClassBody:
                return ClassBodyTransformer.transformClassBody(node)
            case Es6SyntaxName.ClassElement:
                return ClassElementTransformer.transformClassElement(node)
            case Es6SyntaxName.MethodDefinition:
                return MethodDeclarationTransformerEs6.transformMethodDeclaration(node)
        }
        if (!result) {
            result = Es5Transformer.transform(node)
        }
        return result;
    }
}