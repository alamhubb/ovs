import ts, {SourceFile} from "typescript";
import {cleanObject} from "@/ovs/util/clearOtherAttr";


export function ovsGenerateAstToTsCode(typescriptAst: SourceFile): string {
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed, // 设置换行符
        removeComments: false,             // 保留注释
    });
    const tsCode = printer.printFile(typescriptAst);

    console.log(tsCode)

    return tsCode
}

export function ovsGenerateCodeToTsCode(code: string): string {
    const sourceFile: SourceFile = ovsParserToTsAst(code)

    const tsCode = ovsGenerateAstToTsCode(sourceFile);

    return tsCode
}


export function ovsParserToTsAst(code: string): SourceFile {
    const id = "_$$ovs$$temp$$ovsToTsAst.ts"
    // 解析代码，生成语法树 (SourceFile)
    const sourceFile = ts.createSourceFile(
        id,            // 虚拟文件名
        code,                    // 要解析的代码
        ts.ScriptTarget.ESNext
    );

    const sourceFileAst = sourceFile

    cleanObject(sourceFileAst)

    console.log(JSON.stringify(sourceFileAst))
    return sourceFileAst
}
