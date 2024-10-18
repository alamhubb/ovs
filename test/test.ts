import {vitePluginOvsTransform} from "@/index.js";

const code = `
div{123}
`
const res = vitePluginOvsTransform(code)

console.log(res)
