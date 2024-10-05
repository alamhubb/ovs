import ts from "typescript";
import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5TokenName, ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import Es6Transformer from "@/ovs/transform/transformEs6/Es6Transformer";

export default class ClassDeclarationEs6Transformer {
    static transformClassDeclaration(classDeclaration: ChevrotainEcma5Ast) {
        let kind
        let name
        let members
        for (const child of classDeclaration.children) {
            if (child.tokenTypeName === ES6TokenName.ClassTok) {
                kind = ts.SyntaxKind.ClassDeclaration
            } else if (child.tokenTypeName === Es5TokenName.Identifier) {
                name = Es5Transformer.transform(child)
            }else if (child.tokenTypeName === Es6SyntaxName.ClassBody) {
                members = Es6Transformer.transform(child)
            }
        }


        return {
            "kind": kind,
            "name": name,
            "members": members
        }
    }
}