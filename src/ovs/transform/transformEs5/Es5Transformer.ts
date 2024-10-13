import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5SyntaxName} from "@/grammars/ecma5/Es5Parser";
import ProgramTransformerEs5 from "@/ovs/transform/transformEs5/ProgramTransformerEs5";
import SourceElementsEs5Transformer from "@/ovs/transform/transformEs5/SourceElementsEs5Transformer";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";
import {Es5TokenName} from "@/grammars/ecma5/ecma5_tokens";
import IdentifierTransformer from "@/ovs/transform/transformEs5/IdentifierTransformer";
import PropertyNameTransformerEs5 from "@/ovs/transform/transformEs5/PropertyNameTransformerEs5";
import ReturnStatementEs5Transformer from "@/ovs/transform/transformEs5/ReturnStatementEs5Transformer";

export default class Es5Transformer {
    static transform(node: ChevrotainEcma5Ast) {
        console.log('触发了es5 transform:', node.name)
        switch (node.name) {
            case Es5SyntaxName.Program:
                return ProgramTransformerEs5.transformProgram(node);
            case Es5SyntaxName.SourceElements:
                return SourceElementsEs5Transformer.transformSourceElements(node);
            case Es5SyntaxName.Statement:
                return StatementEs5Transformer.transformStatement(node);
            case Es5SyntaxName.PropertyName:
                return PropertyNameTransformerEs5.transformPropertyName(node);
            case Es5TokenName.Identifier:
                return IdentifierTransformer.transformIdentifier(node);
            case Es5SyntaxName.ReturnStatement:
                return ReturnStatementEs5Transformer.transformEs5ReturnStatement(node);
            // 添加更多节点类型的转换方法
            default:
                throw Error(`未处理的节点类型: ${node.name}`);
        }
    }
}