import {OvsSyntaxName} from "../../parser/OvsChevrotainParser.ts";
import ChevrotainEcma5Cst from "../../model/ChevrotainEcma5Cst.ts";
import ts, {SourceFile, Statement} from "typescript";
import {Es5SyntaxName} from "../../../grammars/ecma5/ecma5_parser.ts";
import ChevrotainEcma5Ast from "../../model/ChevrotainEcma5Ast.ts";
import {
    ArgumentsExtendNode,
    DeclarationsExtendNode,
    StatementExtendNode,
    TypescriptAstNode, TypescriptTextExtendAstNode
} from "../../TypescriptAstNode.ts";
import {Es5TokenName} from "../../../grammars/ecma5/ecma5_tokens.ts";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import {Doko} from "@/doko/doko";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import RenderDomOvsTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";


@Doko(VariableStatementOvsChevrotainEs5Transformer)
export default class VariableStatementOvsTransformer {
    dokoObj:VariableStatementOvsChevrotainEs5Transformer

    static getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression: ChevrotainEcma5Ast): TypescriptAstNode<TypescriptTextExtendAstNode> {
        const assignmentExpressionChild = assignmentExpression.children[0]
        if (assignmentExpressionChild.name === OvsSyntaxName.OvsRenderDomStatement) {
            return RenderDomOvsTransformer.transformOvsRenderDom(assignmentExpressionChild)
        } else {
            return VariableStatementOvsTransformer.dokoObj.getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression)
        }
    }
}

