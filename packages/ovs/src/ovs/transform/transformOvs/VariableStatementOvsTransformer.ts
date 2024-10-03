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
import {doke} from "@/doko/doko";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import RenderDomOvsTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";

const ovsToTsTokenEs5SyntaxMap: Map<string, number> = new Map()
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.NumericLiteral, ts.SyntaxKind.NumericLiteral)
ovsToTsTokenEs5SyntaxMap.set(Es5TokenName.Identifier, ts.SyntaxKind.Identifier)


@doke(VariableStatementOvsChevrotainEs5Transformer)
export default class VariableStatementOvsTransformer {
    static getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression: ChevrotainEcma5Ast): TypescriptAstNode<TypescriptTextExtendAstNode> {
        console.log('执行了ovs ')
        //assignmentExpression.BinaryExpression. UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression
        console.log(555555)
        console.log(assignmentExpression.children[0])

        const assignmentExpressionChild = assignmentExpression.children[0]
        if (assignmentExpressionChild.name === OvsSyntaxName.OvsRenderDomStatement) {
            console.log('render dom')
            return RenderDomOvsTransformer.transformOvsRenderDomAst(assignmentExpressionChild)
        } else {

            const primaryExpressionToken = assignmentExpression.children[0].children[0].children[0].children[0].children[0].children[0];

            if (primaryExpressionToken.tokenTypeName === Es5TokenName.Identifier) {
                return {
                    kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
                    escapedText: primaryExpressionToken.image
                }
            } else if (primaryExpressionToken.tokenTypeName === Es5TokenName.NumericLiteral) {
                return {
                    kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
                    text: String(primaryExpressionToken.image)
                }
            } else {
                console.warn(`unexpected tokenTypeName:${primaryExpressionToken.tokenTypeName}:${primaryExpressionToken.image}`)
                return {
                    kind: ovsToTsTokenEs5SyntaxMap.get(primaryExpressionToken.tokenTypeName),
                    //这里应该为 text，todo 待确认
                    escapedText: primaryExpressionToken.image
                }
            }
        }

    }
}

