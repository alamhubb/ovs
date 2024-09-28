// Vite 插件
import {createFilter} from "vite";
import {OvsChevrotainSyntaxDefine} from "./chervotainSyntaxDefine/OvsChevrotainSyntaxDefine.ts";
import {tokenize} from "./ecma5/ecma5_lexer.ts";
import ts, {isMethodDeclaration, SyntaxKind} from "typescript";
import {convertCst} from "./ConvertChevrotainEcma5CstToTypescriptAst.ts";
import {convertCstToChevrotainAst, transformToAST} from "./parser/transformToAST.ts";
import {getChevrotainToTsAst} from "./ovsTest/ovsGenerateAst.ts";

export function vitePluginOvsTransform(code) {
// 创建打印机
    const printer = ts.createPrinter({
        newLine: ts.NewLineKind.LineFeed, // 设置换行符
        removeComments: false,             // 保留注释
    });
    let res1
    res1 = {
        "kind": 307,
        "statements": [
            {
                "kind": 244,
                "expression": {
                    "kind": 213,
                    "expression": {
                        "kind": 80,
                        "escapedText": "h"
                    },
                    "arguments": [
                        {
                            "kind": 11,
                            "text": "div"
                        },
                        {
                            "kind": 9,
                            "text": "123",
                        }
                    ]
                }
            }
        ],
        "text": "",
        "fileName": "fsadfasd.ts",
    }

    res1 = getChevrotainToTsAst(code)

// 将 AST 转换为代码
    const result = printer.printFile(res1);

    console.log(result)
    return result;
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
            console.log(111111)

            let result = vitePluginOvsTransform(code);

            console.log(22222)
            console.log(result)
            // 按行分割
            let lines = result.split('\n');

            const lastLengthIndex = lines.length - 2

            lines[lastLengthIndex] = 'return ' + lines[lastLengthIndex]

            result = lines.join('\n')

            console.log(123)
            console.log(result)
            console.log(456456)

            return `
<script lang="ts">
import {h} from "vue";

export default {
  render() {
    ${result}
  }
}
</script>
`
        }
    };
}
