import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts, {SourceFile, Statement} from "typescript";
import StatementOvsTransformer from "@/ovs/transform/transformOvs/StatementOvsTransformer";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";

export default class ProgramEs5Transformer {
    static transformProgram(programAst: ChevrotainEcma5Ast) {
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
                const statementAst = Es5Transformer.transform(statement)
                if (!statementAst) {
                    throw new Error(`unknown Statement：${statement.name}`)
                }
                statements.push(statementAst)
            })
        })
        return sourceFile
    }
}
