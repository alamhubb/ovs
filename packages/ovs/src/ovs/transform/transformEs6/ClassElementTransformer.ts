import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import ts from "typescript";
import Es6Transformer from "@/ovs/transform/transformEs6/Es6Transformer";

export default class ClassElementTransformer {
    //return members
    static transformClassElement(classElement: ChevrotainEcma5Ast) {
        let modifiers = []
        let res
        for (const child of classElement.children) {
            if (child.name === ES6TokenName.StaticTok) {
                modifiers.push({
                    kind: ts.SyntaxKind.StaticKeyword
                })
            } else if (child.name === Es6SyntaxName.MethodDefinition) {
                res = Es6Transformer.transform(child)
            }
        }
        return {
            ...res,
            modifiers
        }
    }
}