import ts from 'typescript';

//这个文件没用，不直接生成代码，而是生成ast

export function convertCst() {
// 创建 'h' 标识符
    const hIdentifier = ts.factory.createIdentifier('h');


// 创建 'div' 和 '123' 字符串字面量
    const divString = ts.factory.createStringLiteral('div');
    const numberString = ts.factory.createStringLiteral('12223');

// 创建函数调用表达式 h('div', '123')
    const callExpression = ts.factory.createCallExpression(
        hIdentifier,  // 函数名: h
        undefined,    // 类型参数 (这里没有)
        [divString, numberString]  // 参数: ['div', '123']
    );

// 创建语句 h('div', '123');
    const expressionStatement = ts.factory.createExpressionStatement(callExpression);

// 创建包含语句的程序 (SourceFile)
    const sourceFile = ts.factory.createSourceFile(
        [expressionStatement],  // 语句列表
        ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),  // 文件结束标记
        ts.NodeFlags.None
    );

// 将 AST 转换为字符串形式的代码
    const printer = ts.createPrinter();
    const result = printer.printFile(sourceFile);
    return result
}

// 要解析的代码
const code = convertCst();

// 解析代码，生成语法树 (SourceFile)
const sourceFile = ts.createSourceFile(
    'fsadfasd.ts',            // 虚拟文件名
    code,                    // 要解析的代码
    ts.ScriptTarget.ESNext
);

console.log(JSON.stringify(sourceFile))


