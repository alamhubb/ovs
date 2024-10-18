import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import {vitePluginOvsTransform} from "../../plugins/vitePluginOvs.ts";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname)


// 获取当前目录下的文件路径
const filePath = path.join(__dirname, '../views/hello.ovs');

try {
    // 同步读取文件内容
    const data = fs.readFileSync(filePath, 'utf8');
    console.log('文件内容:', data);
    vitePluginOvsTransform(data)
} catch (err) {
    console.error('读取文件时出错:', err);
}
