import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import ts from "typescript";

export default class MethodDeclarationTransformerEs6 {
    //return
    static transformMethodDeclaration(methodDefinition: ChevrotainEcma5Ast) {
        let name
        let body
        for (const child of methodDefinition.children) {
            if (child.name === Es5SyntaxName.PropertyName) {
                name = Es5Transformer.transform(child)
            } else if (child.name === Es5SyntaxName.SourceElements) {
                body = Es5Transformer.transform(child)
            }
        }
        return {
            "kind": ts.SyntaxKind.MethodDeclaration, //MethodDeclaration
            "name": name,
            "parameters": [],
            "body": body
        }
    }
}