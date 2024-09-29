import {OvsSyntaxName} from "../../parser/OvsChevrotainSyntaxDefine.ts";
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
import {ECMAScript6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {tokenIndexMap} from "../../parser/ovsChevrotainParser";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import OvsChevrotainEs5VariableStatementTransformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import StatementOvsChevrotainEs5Transformer from "@/ovs/transform/transformEs5/StatementOvsChevrotainEs5Transformer";
import ExportStatementOvsEs6Transformer from "@/ovs/transform/transformEs6/ExportStatementOvsEs6Transformer";


export default class StatementOvsEs6Transformer {
    static transformStatementAst(parentStatementAst: ChevrotainEcma5Ast): Statement {
        let ast: TypescriptAstNode<StatementExtendNode>
        ast = StatementOvsChevrotainEs5Transformer.transformStatementAst(parentStatementAst)
        if (ast) {
            return ast
        }
        const statementAst = parentStatementAst.children[0]
        if (statementAst.name === Es6SyntaxName.ExportStatement) {
            ast = ExportStatementOvsEs6Transformer.transformExportStatementAst(statementAst);
        }
        return ast

    }
}

