import * as ts from 'typescript';
import {cleanObject} from "../util/clearOtherAttr.ts";

const code =
    `
var a = 10

h('div', a)
\n`


// 要解析的代码

// 解析代码，生成语法树 (SourceFile)
const sourceFile = ts.createSourceFile(
    'fsadfasd.ts',            // 虚拟文件名
    code,                    // 要解析的代码
    ts.ScriptTarget.ESNext
);

const sourceFileAst = sourceFile

cleanObject(sourceFileAst)


console.log(JSON.stringify(sourceFileAst))

// 创建打印机
const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed, // 设置换行符
    removeComments: false,             // 保留注释
});

// 将 AST 转换为代码
const result = printer.printFile(sourceFileAst);

//获取ts生成的语法树，用来对比
