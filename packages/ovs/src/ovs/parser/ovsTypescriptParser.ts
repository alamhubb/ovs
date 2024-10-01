import ts, {SourceFile} from "typescript";
import {cleanObject} from "../util/clearOtherAttr";

export function ovsGenerateAstToTsCode(typescriptAst: SourceFile): string {
    const printer = ts.createPrinter();
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
        //解析的代码的语法规则
        ts.ScriptTarget.ESNext
    );

    const sourceFileAst = sourceFile
console.log(121233)
    cleanObject(sourceFileAst)

    console.log(JSON.stringify(sourceFileAst))
    console.log(456456)
    return sourceFileAst
}
