<script setup lang="ts">
import TestOvs from "@/components/TestOvs.vue";
import hello from "@/components/hello.ovs";

// console.log(TestOvs)
// console.log(hello)

/*import * as ts from 'typescript';

// 要解析的代码
const code = `h('div', '123')`;

// 解析代码，生成语法树 (SourceFile)
const sourceFile = ts.createSourceFile(
    'fsadfasd.ts',            // 虚拟文件名
    code,                    // 要解析的代码
    ts.ScriptTarget.ESNext
);

console.log(JSON.stringify(sourceFile))*/

/*import {OvsParser} from "@/ovs/OvsParser.ts";
import {tokenize} from "@/ovs/ecma5/ecma5_lexer.ts";

const code =
    `
div{
  123
}
`
console.log(code)
const parserInstance = new OvsParser();
const tokens = tokenize(code);
parserInstance.input = tokens;
console.log(tokens)
parserInstance.orgText = code;
const res = parserInstance.Program();
console.log(res)
if (parserInstance.errors.length > 0) {
  console.log(parserInstance.errors)
  throw Error("Sad Sad Panda");
}*/
</script>
<template>
<!--  123-->
<!--    <test-ovs></test-ovs>-->
<!--  <hello></hello>-->
</template>
