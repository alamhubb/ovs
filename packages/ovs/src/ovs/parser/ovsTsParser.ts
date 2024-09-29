import ts, {SourceFile} from "typescript";
import {cleanObject} from "@/ovs/util/clearOtherAttr";

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
