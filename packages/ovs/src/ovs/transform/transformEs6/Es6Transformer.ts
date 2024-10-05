import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";
import ProgramTransformerEs5 from "@/ovs/transform/transformEs5/ProgramTransformerEs5";
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
import ts from "typescript";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {ovsToTsTokenEs5SyntaxMap} from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";

export const ovsToTsTokenEs6SyntaxMap: Map<string, number> = new Map([...ovsToTsTokenEs5SyntaxMap])
ovsToTsTokenEs6SyntaxMap.set(ES6TokenName.ExportTok, ts.SyntaxKind.ExportKeyword)


@Doko(Es5Transformer)
export default class Es6Transformer {
    static dokoObj: Es5Transformer

    static transform(node: ChevrotainEcma5Ast) {
        console.log('触发了es6 transform:', node.name)
        switch (node.name) {
            case Es6SyntaxName.ExportDefaultStatement:
                return ExportDefaultStatementEs6Transformer.transformExportDefaultStatement(node);
            case Es6SyntaxName.ClassDeclaration:
                return ClassDeclarationEs6Transformer.transformClassDeclaration(node);
            case Es6SyntaxName.ClassBody:
                return ClassBodyTransformer.transformClassBody(node)
            case Es6SyntaxName.ClassElement:
                return ClassElementTransformer.transformClassElement(node)
            case Es6SyntaxName.MethodDefinition:
                return MethodDeclarationTransformerEs6.transformMethodDeclaration(node)
        }
        return Es6Transformer.dokoObj.transform(node)
    }
}