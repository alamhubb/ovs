import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";
import ProgramEs5Transformer from "@/ovs/transform/transformEs5/ProgramEs5Transformer";
import SourceElementsEs5Transformer from "@/ovs/transform/transformEs5/SourceElementsEs5Transformer";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";

export default class TransformerEs5 {
   static transform(node:ChevrotainEcma5Ast){
        switch (node.name) {
            case Es5SyntaxName.Program:
                return ProgramEs5Transformer.transformProgram(node);
            case Es5SyntaxName.SourceElements:
                return SourceElementsEs5Transformer.transformSourceElements(node);
            case Es5SyntaxName.Statement:
                return StatementEs5Transformer.transformStatement(node);

            case "PropertyName":
                return this.transformPropertyName(node as SourceNode);
            case "ReturnStatement":
                return this.transformReturnStatement(node as SourceNode);
            case "Expression":
                return this.transformExpression(node as SourceNode);
            case "AssignmentExpression":
                return this.transformAssignmentExpression(node as SourceNode);
            case "BinaryExpression":
                return this.transformBinaryExpression(node as SourceNode);
            case "UnaryExpression":
                return this.transformUnaryExpression(node as SourceNode);
            case "PostfixExpression":
                return this.transformPostfixExpression(node as SourceNode);
            case "MemberCallNewExpression":
                return this.transformMemberCallNewExpression(node as SourceNode);
            case "PrimaryExpression":
                return this.transformPrimaryExpression(node as SourceNode);
            // 添加更多节点类型的转换方法
            default:
                console.warn(`未处理的节点类型: ${node.name}`);
                return {};
        }
    }
}