import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import ts, {SourceFile, Statement} from "typescript";
import StatementOvsTransformer from "@/ovs/transform/transformOvs/StatementOvsTransformer";
import Es5Transformer from "@/ovs/transform/transformEs5/Es5Transformer";
import {Es5SyntaxName} from "@/grammars/ecma5/ecma5_parser";

export default class ProgramTransformerEs5 {
    static transformProgram(programAst: ChevrotainEcma5Ast) {
        if (programAst.name !== Es5SyntaxName.Program) {
            throw "解析错误"
        }
        let statement

        for (const child of programAst.children) {
            if (child.name === Es5SyntaxName.SourceElements) {
                statement = Es5Transformer.transform(child)
            }
        }
        if (!statement) {
            throw Error('错误的语法')
        }

        const sourceFile: SourceFile = {
            kind: ts.SyntaxKind.SourceFile,
            statements: [statement],
            text: "",
            fileName: "_$$ovs$$temp$$ovsToTsAst.ts"
        }
        return sourceFile
    }
}
