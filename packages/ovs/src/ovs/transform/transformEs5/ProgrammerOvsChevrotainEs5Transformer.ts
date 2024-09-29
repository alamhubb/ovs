/*
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
import OvsChevrotainEs5StatementTransformer from "@/ovs/transform/transformEs5/StatementOvsChevrotainEs5Transformer";
import StatementOvsChevrotainEs5Transformer from "@/ovs/transform/transformEs5/StatementOvsChevrotainEs5Transformer";


export default class ProgrammerOvsChevrotainEs5Transformer {
    /!**
     * Convert ovs Chevrotain cst to ast
     * @param programAst
     *!/
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
                const statementAst = StatementOvsChevrotainEs5Transformer.transformStatementAst(statement)
                if (!statementAst) {
                    throw new Error(`unknown Statement：${statement.name}`)
                }
                statements.push(statementAst)
            })
        })
        return sourceFile
    }
}
*/
