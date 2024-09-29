import {createToken} from "chevrotain";
import {AbsKeyword} from "../ecma5/ecma5_tokens";

export * from "../ecma5/ecma5_tokens";

// ES6 新增的标记

// 关键字
export const LetTok = createToken({name: "LetTok", pattern: /let/, categories: AbsKeyword});
export const ConstTok = createToken({name: "ConstTok", pattern: /const/, categories: AbsKeyword});
export const ClassTok = createToken({name: "ClassTok", pattern: /class/, categories: AbsKeyword});
export const ExtendsTok = createToken({name: "ExtendsTok", pattern: /extends/, categories: AbsKeyword});
export const StaticTok = createToken({name: "StaticTok", pattern: /static/, categories: AbsKeyword});
export const ImportTok = createToken({name: "ImportTok", pattern: /import/, categories: AbsKeyword});
export const FromTok = createToken({name: "FromTok", pattern: /from/, categories: AbsKeyword});
export const ExportTok = createToken({name: "ExportTok", pattern: /export/, categories: AbsKeyword});
export const AsTok = createToken({name: "AsTok", pattern: /as/, categories: AbsKeyword});

// 箭头函数
export const Arrow = createToken({name: "Arrow", pattern: /=>/});

// 模板字符串
export const BackTick = createToken({name: "BackTick", pattern: /`/});
export const TemplateCharacters = createToken({name: "TemplateCharacters", pattern: /[^`$]+/});
export const DollarCurly = createToken({name: "DollarCurly", pattern: /\${/});

// 扩展运算符
export const Ellipsis = createToken({name: "Ellipsis", pattern: /\.\.\./});
