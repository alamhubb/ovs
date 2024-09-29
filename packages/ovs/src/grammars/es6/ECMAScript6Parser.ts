import {ECMAScript5Parser, ENABLE_SEMICOLON_INSERTION, Es5SyntaxName} from "../ecma5/ecma5_parser";
import * as es6AllTokens from "./ECMAScript6Token";

export class ECMAScript6Parser extends ECMAScript5Parser {
    constructor(isInvokedByChildConstructor = false) {
        super();
        const $ = this;

        // 模块导出
        $.RULE("ExportDeclaration", () => {
            $.CONSUME(es6AllTokens.ExportTok);
            $.OR([
                { ALT: () => $.SUBRULE($.ExportClause) },
                { ALT: () => $.SUBRULE($[Es5SyntaxName.VariableDeclaration]) },
                { ALT: () => $.CONSUME(es6AllTokens.DefaultTok) }
            ]);
            $.CONSUME(es6AllTokens.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        $.RULE("ExportClause", () => {
            $.CONSUME(es6AllTokens.LCurly);
            $.MANY_SEP({
                SEP: es6AllTokens.Comma,
                DEF: () => {
                    $.SUBRULE($.ExportSpecifier);
                }
            });
            $.CONSUME(es6AllTokens.RCurly);
        });

        $.RULE("ExportSpecifier", () => {
            $.CONSUME(es6AllTokens.Identifier);
            $.OPTION(() => {
                // $.CONSUME(es6AllTokens.AsTok);
                $.CONSUME2(es6AllTokens.Identifier);
            });
        });

        // ES6 新增的语法规则
        // 块级作用域和变量声明
        /*$.OVERRIDE_RULE("VariableStatement", () => {
            $.OR([
                // { ALT: () => $.CONSUME(es6AllTokens.LetTok) },
                { ALT: () => $.CONSUME(es6AllTokens.ConstTok) },
                { ALT: () => $.CONSUME(es6AllTokens.VarTok) }
            ]);
            $.SUBRULE($.VariableDeclarationList);
            $.CONSUME(es6AllTokens.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // 箭头函数
        $.RULE("ArrowFunction", () => {
            $.OPTION(() => {
                $.SUBRULE($.FormalParameterList);
            });
            $.CONSUME(es6AllTokens.Arrow);
            $.SUBRULE($.ConciseBody);
        });

        $.RULE("ConciseBody", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.AssignmentExpression) },
                { ALT: () => $.SUBRULE($.Block) }
            ]);
        });

        // 类声明
        $.RULE("ClassDeclaration", () => {
            $.CONSUME(es6AllTokens.ClassTok);
            $.CONSUME(es6AllTokens.Identifier);
            $.OPTION(() => {
                $.SUBRULE($.ClassHeritage);
            });
            $.SUBRULE($.ClassBody);
        });

        $.RULE("ClassHeritage", () => {
            $.CONSUME(es6AllTokens.ExtendsTok);
            // $.SUBRULE($.LeftHandSideExpression);
        });

        $.RULE("ClassBody", () => {
            $.CONSUME(es6AllTokens.LCurly);
            $.MANY(() => {
                $.SUBRULE($.ClassElement);
            });
            $.CONSUME(es6AllTokens.RCurly);
        });

        $.RULE("ClassElement", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.MethodDefinition) },
                { ALT: () => $.CONSUME(es6AllTokens.Semicolon) }
            ]);
        });

        $.RULE("MethodDefinition", () => {
            // $.OPTION(() => {
            //     $.CONSUME(es6AllTokens.StaticTok);
            // });
            $.SUBRULE($.PropertyName);
            $.CONSUME(es6AllTokens.LParen);
            $.OPTION(() => {
                $.SUBRULE($.FormalParameterList);
            });
            $.CONSUME(es6AllTokens.RParen);
            $.CONSUME(es6AllTokens.LCurly);
            $.SUBRULE($.SourceElements);
            $.CONSUME(es6AllTokens.RCurly);
        });

        // 模板字符串
        $.RULE("TemplateLiteral", () => {
            $.CONSUME(es6AllTokens.BackQuote);
            $.MANY(() => {
                $.OR([
                    // { ALT: () => $.CONSUME(es6AllTokens.TemplateCharacters) },
                    { ALT: () => $.SUBRULE($.TemplateSubstitution) }
                ]);
            });
            $.CONSUME(es6AllTokens.BackQuote);
        });

        $.RULE("TemplateSubstitution", () => {
            $.CONSUME(es6AllTokens.DollarCurly);
            $.SUBRULE($.Expression);
            $.CONSUME(es6AllTokens.RCurly);
        });

        // 模块导入
        $.RULE("ImportDeclaration", () => {
            $.CONSUME(es6AllTokens.ImportTok);
            $.OR([
                { ALT: () => $.SUBRULE($.ImportClause) },
                { ALT: () => $.CONSUME(es6AllTokens.StringLiteral) }
            ]);
            // $.CONSUME(es6AllTokens.FromTok);
            $.CONSUME2(es6AllTokens.StringLiteral);
            $.CONSUME(es6AllTokens.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        $.RULE("ImportClause", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.ImportedDefaultBinding) },
                { ALT: () => $.SUBRULE($.NameSpaceImport) },
                { ALT: () => $.SUBRULE($.NamedImports) }
            ]);
        });

        $.RULE("ImportedDefaultBinding", () => {
            $.CONSUME(es6AllTokens.Identifier);
        });

        $.RULE("NameSpaceImport", () => {
            $.CONSUME(es6AllTokens.Asterisk);
            // $.CONSUME(es6AllTokens.AsTok);
            $.CONSUME(es6AllTokens.Identifier);
        });

        $.RULE("NamedImports", () => {
            $.CONSUME(es6AllTokens.LCurly);
            $.MANY_SEP({
                SEP: es6AllTokens.Comma,
                DEF: () => {
                    $.SUBRULE($.ImportSpecifier);
                }
            });
            $.CONSUME(es6AllTokens.RCurly);
        });

        $.RULE("ImportSpecifier", () => {
            $.CONSUME(es6AllTokens.Identifier);
            $.OPTION(() => {
                // $.CONSUME(es6AllTokens.AsTok);
                $.CONSUME2(es6AllTokens.Identifier);
            });
        });



        // 解构赋值
        $.RULE("DestructuringAssignment", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.ObjectDestructuring) },
                { ALT: () => $.SUBRULE($.ArrayDestructuring) }
            ]);
        });

        $.RULE("ObjectDestructuring", () => {
            $.CONSUME(es6AllTokens.LCurly);
            $.MANY_SEP({
                SEP: es6AllTokens.Comma,
                DEF: () => {
                    $.SUBRULE($.AssignmentProperty);
                }
            });
            $.CONSUME(es6AllTokens.RCurly);
        });

        $.RULE("ArrayDestructuring", () => {
            $.CONSUME(es6AllTokens.LBracket);
            $.MANY_SEP({
                SEP: es6AllTokens.Comma,
                DEF: () => {
                    $.SUBRULE($.AssignmentElement);
                }
            });
            $.CONSUME(es6AllTokens.RBracket);
        });

        $.RULE("AssignmentProperty", () => {
            $.SUBRULE($.PropertyName);
            $.CONSUME(es6AllTokens.Colon);
            $.SUBRULE($.AssignmentExpression);
        });

        $.RULE("AssignmentElement", () => {
            $.SUBRULE($.AssignmentExpression);
        });

        // 扩展运算符
        $.RULE("SpreadElement", () => {
            $.CONSUME(es6AllTokens.Ellipsis);
            $.SUBRULE($.AssignmentExpression);
        });*/

        // 左值表达式
        /*$.RULE("LeftHandSideExpression", () => {
            $.OR([
                { ALT: () => $.SUBRULE($.NewExpression) },
                { ALT: () => $.SUBRULE($.CallExpression) }
            ]);
        });*/

        if (!isInvokedByChildConstructor) {
            this.performSelfAnalysis();
        }
    }
}
