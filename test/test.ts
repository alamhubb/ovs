import {vitePluginOvsTransform} from "../src";

const code = `
div{123}
`
const res = vitePluginOvsTransform(code)

console.log(res)
