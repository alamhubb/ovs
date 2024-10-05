import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import Es6Transformer from "@/ovs/transform/transformEs6/Es6Transformer";
import {Es6SyntaxName} from "@/grammars/es6/Es6Parser";

export default class ClassBodyTransformer {
    //return  members
    static transformClassBody(classBody: ChevrotainEcma5Ast) {
        let members = []
        for (const child of classBody.children) {
            if (child.name === Es6SyntaxName.ClassElement) {
                let member = Es6Transformer.transform(child)
                members.push(member)
            }
        }
        return members
    }
}