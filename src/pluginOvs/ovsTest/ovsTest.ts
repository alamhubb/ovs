import {code} from "./code.ts";
import {vitePluginOvsTransform} from "../vitePluginOvs.ts";

// 将 AST 转换为代码
const result = vitePluginOvsTransform(code);
