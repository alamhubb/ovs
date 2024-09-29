import {cleanObject} from "../../util/clearOtherAttr";
import * as fs from "node:fs";

// 读取 JSON 文件
try {
    const json = fs.readFileSync('./testjson.json', 'utf-8'); // 读取文件内容

    const sourceFile = JSON.parse(json)

    cleanObject(sourceFile)

    console.log(JSON.stringify(sourceFile));
} catch (error) {
    console.error('Error reading or parsing the file:', error);
}


