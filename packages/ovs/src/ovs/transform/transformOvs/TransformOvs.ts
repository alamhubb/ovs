import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es6SyntaxName} from "@/grammars/es6/Es6Parser";
import ExportDefaultStatementEs6Transformer from "@/ovs/transform/transformEs6/ExportDefaultStatementEs6Transformer";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import {OvsSyntaxName} from "@/ovs/parser/OvsChevrotainParser";
import RenderDomOvsTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import Es6Transformer from "@/ovs/transform/transformEs6/Es6Transformer";
import {Doko} from "@/doko/doko";

@Doko(Es6Transformer)
export default class TransformOvs {
    static dokoObj: Es6Transformer

    static transform(node: ChevrotainEcma5Ast) {
        console.log('触发了ovs transform:', node.name)
        switch (node.name) {
            case OvsSyntaxName.OvsRenderDomStatement:
                return RenderDomOvsTransformer.transformOvsRenderDom(node);
        }
        return TransformOvs.dokoObj.transform(node)
    }
}