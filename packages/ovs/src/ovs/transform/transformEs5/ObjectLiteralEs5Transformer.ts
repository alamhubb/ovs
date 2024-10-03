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
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import StatementEs5Transformer from "@/ovs/transform/transformEs5/StatementEs5Transformer";
import SourceElementsEs5Transformer from "@/ovs/transform/transformEs5/SourceElementsEs5Transformer";

export default class ObjectLiteralEs5Transformer {
    static transformObjectLiteralAst(syntax: ChevrotainEcma5Ast) {
        let nameKind
        let body
        const objectLiteralChildren = syntax.children
        for (const objectLiteralChild of objectLiteralChildren) {
            if (objectLiteralChild.name === Es5SyntaxName.PropertyAssignment) {
                const regularPropertyAssignment = objectLiteralChild.children[0]
                const regularPropertyAssignmentChildren = regularPropertyAssignment.children
                for (const regularPropertyAssignmentChild of regularPropertyAssignmentChildren) {
                    if (regularPropertyAssignmentChild.name === Es5SyntaxName.PropertyName) {
                        const token = regularPropertyAssignmentChild.children[0]
                        nameKind = VariableStatementOvsChevrotainEs5Transformer.getPrimaryExpressionTokenByAssignmentExpression(token)
                    } else if (regularPropertyAssignmentChild.name === Es5SyntaxName.SourceElements) {
                        body = SourceElementsEs5Transformer.transformEs5SourceElements(regularPropertyAssignmentChild)
                    }
                }
            }
        }
        return {
            kind: ts.SyntaxKind.ObjectLiteralExpression,
            "properties": [{
                kind: ts.SyntaxKind.MethodDeclaration,
                name: nameKind,
                "parameters": [],
                "body": body
            }]
        }
    }
}

