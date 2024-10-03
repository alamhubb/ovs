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
import OvsChevrotainEs5VariableStatementTransformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import ReturnStatementEs5Transformer from "@/ovs/transform/transformEs5/ReturnStatementEs5Transformer";
import VariableStatementOvsChevrotainEs5Transformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";


export default class StatementEs5Transformer {
    static transformStatementAst(parentStatementAst: ChevrotainEcma5Ast): Statement {
        let ast: TypescriptAstNode<StatementExtendNode>
        const statementAst = parentStatementAst.children[0]
        if (statementAst.name === Es5SyntaxName.VariableStatement) {
            ast = OvsChevrotainEs5VariableStatementTransformer.transformVariableStatementAst(statementAst);
        } else if (statementAst.name === Es5SyntaxName.ReturnStatement) {
            ast = ReturnStatementEs5Transformer.transformEs5ReturnStatement(statementChild)
        }
        return ast
    }
}

