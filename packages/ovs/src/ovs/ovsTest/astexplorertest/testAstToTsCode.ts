import ts from "typescript";


// 读取源文件
const fileName = "input.ts";
const program = ts.createProgram([fileName], {});
const sourceFile = program.getSourceFile(fileName);

// 转换并输出
if (sourceFile) {
    const result = ts.transform(sourceFile, [transformer()]);
    const printer = ts.createPrinter();

    // 获取转换后的结果
    const transformedSourceFile = result.transformed[0];
    const newContent = printer.printFile(transformedSourceFile);

    console.log(newContent); // 输出转换后的代码
}
