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
import OvsChevrotainEs5StatementTransformer from "@/ovs/transform/transformEs5/StatementOvsChevrotainEs5Transformer";
import StatementOvsTransformer from "@/ovs/transform/transformOvs/StatementOvsTransformer";
import OvsDomRenderTransformer from "@/ovs/transform/transformOvs/RenderDomOvsTransformer";
import OvsChevrotainEs5VariableStatementTransformer
    from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import "./VariableStatementOvsTransformer"


export default class ProgrammerOvsTransformer {
    /**
     * Convert ovs Chevrotain cst to ast
     * @param programAst
     */
    static transformOvsAstToTsAst(programAst: ChevrotainEcma5Ast): SourceFile {
        if (programAst.name !== Es5SyntaxName.Program) {
            throw "解析错误"
        }
        const statements: Statement [] = []

        const sourceFile: SourceFile = {
            kind: ts.SyntaxKind.SourceFile,
            statements: statements,
            text: "",
            fileName: "_$$ovs$$temp$$ovsToTsAst.ts"
        }
        programAst.children.forEach(sourceElements => {
            sourceElements.children.forEach(statement => {
                const statementAst = StatementOvsTransformer.transformStatementAst(statement)
                if (!statementAst) {
                    throw new Error(`unknown Statement：${statement.name}`)
                }
                statements.push(statementAst)
            })
        })
        return sourceFile
    }
}
