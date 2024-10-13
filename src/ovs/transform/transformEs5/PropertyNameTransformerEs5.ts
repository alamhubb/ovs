import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";

export default class PropertyNameTransformerEs5 {
    static transformPropertyName(propertyNameNode: ChevrotainEcma5Ast) {
        return Es5Transformer.transform(propertyNameNode.children[0])
    }
}