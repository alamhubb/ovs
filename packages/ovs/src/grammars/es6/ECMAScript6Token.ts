import {createToken} from "chevrotain";
import {AbsKeyword, Question} from "../ecma5/ecma5_tokens";

export * from "../ecma5/ecma5_tokens";


export enum ECMAScript6TokenName {
    ConstTok = 'ConstTok',
    ClassTok = 'ClassTok',
    ExtendsTok = 'ExtendsTok',
    ExportTok = 'ExportTok',
    ImportTok = 'ImportTok',

    Arrow = 'Arrow',
    BackQuote = 'BackQuote',
    DollarCurly = 'DollarCurly',
    Ellipsis = 'Ellipsis',
}

// ES6 新增的标记

// 关键字
//未使用
// export const LetTok = createToken({name: "LetTok", pattern: /let/, categories: AbsKeyword});
// export const StaticTok = createToken({name: "StaticTok", pattern: /static/, categories: AbsKeyword});
// export const FromTok = createToken({name: "FromTok", pattern: /from/, categories: AbsKeyword});
// export const AsTok = createToken({name: "AsTok", pattern: /as/, categories: AbsKeyword});
//已使用
export const ConstTok = createToken({name: ECMAScript6TokenName.ConstTok, categories: AbsKeyword});
export const ClassTok = createToken({name: ECMAScript6TokenName.ClassTok, categories: AbsKeyword});
export const ExtendsTok = createToken({name: ECMAScript6TokenName.ExtendsTok, categories: AbsKeyword});
export const ExportTok = createToken({name: ECMAScript6TokenName.ExportTok, categories: AbsKeyword});
export const ImportTok = createToken({name: ECMAScript6TokenName.ImportTok, categories: AbsKeyword});


// 箭头函数
export const Arrow = createToken({name: ECMAScript6TokenName.Arrow, categories: Question});

// 模板字符串
export const BackQuote = createToken({name: ECMAScript6TokenName.BackQuote, categories: Question});
export const DollarCurly = createToken({name: ECMAScript6TokenName.DollarCurly, categories: Question});
//未使用
// export const TemplateCharacters = createToken({name: "TemplateCharacters", pattern: /[^`$]+/});

// 扩展运算符
export const Ellipsis = createToken({name: ECMAScript6TokenName.Ellipsis, categories: Question});


// (	parentheses
// [	bracket
// {	brace ,curly brace ,curly bracket
