import ts from "typescript";
import {cleanObject} from "../util/clearOtherAttr";
import {ovsGenerateAstToTsCode} from "../parser/ovsTsParser";

const id = "example.ts";  // 虚拟文件名
const code = `
    const x = 10;
    const y = 20;
    const sum = () => x + y;
`;

const sourceFile = ts.createSourceFile(
    id,
    code,
    ts.ScriptTarget.ES2015  // 解析为 ES6
);

cleanObject(sourceFile)

console.log(JSON.stringify(sourceFile));

const res = ovsGenerateAstToTsCode(sourceFile)
// 进行其他操作...

console.log(res);
