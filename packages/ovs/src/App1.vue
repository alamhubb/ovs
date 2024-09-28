<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty';
import 'vue-json-pretty/lib/styles.css';

const data =1
import {ECMAScript5Parser} from "@/ecma5/ecma5_parser";
import {tokenize} from "@/ecma5/ecma5_lexer";

const parserInstance = new ECMAScript5Parser();
const code = `1+2*3`
const tokens = tokenize(code);
parserInstance.input = tokens;
console.log(tokens)
parserInstance.orgText = code;
const res = parserInstance.Program();
if (parserInstance.errors.length > 0) {
  throw Error("Sad Sad Panda");
}
recorseConsole(res)

function recorseConsole(res) {
  console.log(res)
  for (const child in res) {
    if (typeof res[child] === 'object') {
      recorseConsole(res[child])
    }
  }
}
</script>

<template>
  <div>
    <vue-json-pretty :data="res" :show-icon="true"/>
  </div>
</template>
