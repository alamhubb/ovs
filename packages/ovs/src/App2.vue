<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';
import {CalculatorLexer, CalculatorPure} from "@/caclulator/cacl_parser.ts";
import TreeView from "@/components/TreeView.vue";
import "./testSql.ts"
import "./OvsParser.ts"
import {tokenize} from "@/ecma5/ecma5_lexer"
import {ECMAScript5Parser} from "@/ecma5/ecma5_parser"
// console.log(res)


// const code = 'var a = 1+2*3+4'
const code = '1+2'
// const tokens = tokenize(code);
// const parserInstance = new ECMAScript5Parser();
// parserInstance.input = tokens;
// parserInstance.orgText = code;
// const res1 = parserInstance.Program();
// let res = transform('expression', res1, 0)


let lexingResult = CalculatorLexer.tokenize(code)
// wrapping it all together
// reuse the same parser instance.
const parser = new CalculatorPure([])
parser.input = lexingResult.tokens
let res1 = parser.expression();
// console.log(res1)
let res = transform('expression', res1, 0)
//
//
// console.log(res1)
// console.log(res)

//expression {name,child}
function transform(nodeKey, node, level) {
  const result = {key: nodeKey, name: node.name, image: node.image, children: [], level};
  // {additionExpression:[]}
  const childObj = node.children
  if (childObj) {
    //additionExpression:[]
    Object.keys(childObj).forEach((key) => {
      //additionExpression
      //对象属性的名字，这个属性对应的是个数组
      //数组，数组里面只有一个元素，
      //[]
      const keyValue = node.children[key]
      //得到数组里面的这个对象
      //{name: 'additionExpression', children: {…}}
      keyValue.forEach(indexChild => {
        // {name,child}
        const transformChild = transform(key, indexChild, level + 1)
        // Object.keys(indexChild.children).forEach(realKey => {
        //   const realChild = indexChild.children[realKey]
        // const transformChild = transform(realKey, realChild[0], level + 1)
        result.children.push(transformChild)
        // })
        // console.log(indexChild)
      })
    })
  }
  return result;
}
</script>

<template>
  <div class="w100p">
    <!--    <vue-json-pretty :data="res1" :show-icon="true"/>-->
    <!--    <vue-json-pretty :data="res" :show-icon="true"/>-->
    <tree-view :node="res"></tree-view>
  </div>
</template>
