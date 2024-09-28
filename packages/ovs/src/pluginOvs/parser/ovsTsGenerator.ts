import ts, {SourceFile} from "typescript";

export function ovsGenerateTsCode(typescriptAst: SourceFile): string {
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed, // 设置换行符
        removeComments: false,             // 保留注释
    });
    const tsCode = printer.printFile(sourceFileAst);
    return tsCode
}
