import {OvsSyntaxName} from "../../parser/OvsChevrotainParser.ts";
import ChevrotainEcma5Cst from "../../model/ChevrotainEcma5Cst.ts";
import ts, {SourceFile, Statement} from "typescript";
import {Es5SyntaxName} from "../../../grammars/ecma5/Es5Parser.ts";
import ChevrotainEcma5Ast from "../../model/ChevrotainEcma5Ast.ts";
import {
    ArgumentsExtendNode,
    DeclarationsExtendNode,
    StatementExtendNode,
    TypescriptAstNode, TypescriptTextExtendAstNode
} from "../../TypescriptAstNode.ts";
import {Es5TokenName} from "../../../grammars/ecma5/ecma5_tokens.ts";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {Es6SyntaxName} from "@/grammars/es6/Es6Parser";
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import {Doko, dokoFun} from "@/doko/doko";
import ObjectLiteralEs5Transformer from "@/ovs/transform/transformEs5/ObjectLiteralEs5Transformer";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import ConciseMethodAssignmentEs6Transformer from "@/ovs/transform/transformEs6/ConciseMethodAssignmentEs6Transformer";


@Doko(ObjectLiteralEs5Transformer)
export default class ObjectLiteralEs6Transformer {
    static transformObjectLiteralAst(syntax: ChevrotainEcma5Ast) {
        console.log(88888)
        console.log(syntax)

        let propertiesObj
        const objectLiteralChildren = syntax.children
        for (const objectLiteralChild of objectLiteralChildren) {
            if (objectLiteralChild.name === Es5SyntaxName.PropertyAssignment) {
                const regularPropertyAssignment = objectLiteralChild.children[0]
                if (regularPropertyAssignment.name === Es6SyntaxName.ConciseMethodAssignment){
                    propertiesObj = ConciseMethodAssignmentEs6Transformer.transformEs6ConciseMethodAssignment(regularPropertyAssignment)
                }

            }
        }
        console.log(555555)
        return {
            kind: ts.SyntaxKind.ObjectLiteralExpression,
            properties: [propertiesObj]
        }
    }
}

