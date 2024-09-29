import * as acorn from "acorn";

const str = 'let a = 10'
const tokens = acorn.tokenizer(str, {ecmaVersion: 6})
for (const token of tokens) {
    console.log(token.type)
}
