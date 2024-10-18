// Vite 插件
import {createFilter, Plugin} from "vite";

function traverseClearTokens(currentNode: SubhutiCst) {
    if (!currentNode || !currentNode.children || !currentNode.children.length)
        return;
    // 将当前节点添加到 Map 中
    // 递归遍历子节点
    if (currentNode.children && currentNode.children.length > 0) {
        currentNode.children.forEach(child => traverseClearTokens(child));
    }
    currentNode.tokens = undefined
    return currentNode
}

export function vitePluginOvsTransform(code) {
    const lexer = new Subh
    utiLexer(es6Tokens)
    const tokens = lexer.lexer(code)
    const parser = new OvsParser(tokens)
    let res = parser.Program()
    let code1 = parser.exec()
    const mapping = new OvsMappingParser()
    mapping.openMappingMode(res)
    code1 = mapping.exec(res)
    return`
    import { h } from "vue";\n
    ${code1}
    `
}

export default function vitePluginOvs(): Plugin {
    const filter = createFilter(
        /\.ovs$/,
        null,
    )
    return {
        enforce: 'pre',
        transform(code, id) {
            if (!filter(id)) {
                return
            }
            code = vitePluginOvsTransform(code);


            return code
        }
    }
}
