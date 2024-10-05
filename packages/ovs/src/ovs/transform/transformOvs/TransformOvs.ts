import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import ExportDefaultStatementEs6Transformer from "@/ovs/transform/transformEs6/ExportDefaultStatementEs6Transformer";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import {OvsSyntaxName} from "@/ovs/parser/OvsChevrotainParser";
import RenderDomOvsTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import Es6Transformer from "@/ovs/transform/transformEs6/Es6Transformer";
import {Doko} from "@/doko/doko";

@Doko(Es6Transformer)
export default class TransformOvs {
    static transform(node: ChevrotainEcma5Ast) {
        let result
        switch (node.name) {
            case OvsSyntaxName.OvsRenderDomStatement:
                result = RenderDomOvsTransformer.transformOvsRenderDom(node);
        }
        if (!result) {
            result = Es6Transformer.transform(node)
        }
        return result;
    }
}