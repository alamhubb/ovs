import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import ExportDefaultStatementEs6Transformer from "@/ovs/transform/transformEs6/ExportDefaultStatementEs6Transformer";
import TransformerEs5 from "@/ovs/transform/transformEs5/TransformerEs5";
import {OvsSyntaxName} from "@/ovs/parser/OvsChevrotainParser";
import RenderDomOvsTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import TransformerEs6 from "@/ovs/transform/transformEs6/TransformerEs6";
import {Doko} from "@/doko/doko";

@Doko(TransformerEs6)
export default class TransformOvs {
    static transform(node: ChevrotainEcma5Ast) {
        let result
        switch (node.name) {
            case OvsSyntaxName.OvsRenderDomStatement:
                result = RenderDomOvsTransformer.transformOvsRenderDom(node);
        }
        if (!result) {
            result = TransformerEs6.transform(node)
        }
        return result;
    }
}