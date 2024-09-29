import ts from "typescript";
import {cleanObject} from "../../util/clearOtherAttr";
import {ovsGenerateAstToTsCode} from "../ovsTsParser";

const id = "_$$ovs$$temp$$ovsToTsAst.ts"  // 虚拟文件名
const code = `
    export var a = 10;
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
