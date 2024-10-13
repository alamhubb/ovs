import {Es5Parser, ENABLE_SEMICOLON_INSERTION, Es5SyntaxName} from "../ecma5/Es5Parser";
import * as es6AllTokens from "./ECMAScript6Token";
import * as t from "@/grammars/ecma5/ecma5_tokens";

export enum Es6SyntaxName {
    ExportStatement = 'ExportStatement',
    ClassDeclaration = 'ClassDeclaration',
    ClassBody = 'ClassBody',
    ClassElement = 'ClassElement',
    MethodDefinition = 'MethodDefinition',
    ExportDefaultStatement = 'ExportDefaultStatement',
    ConciseMethodAssignment = 'ConciseMethodAssignment',
}

export class Es6Parser extends Es5Parser {

    readonly StatementValue = []

    constructor(isInvokedByChildConstructor = false) {
        super();
        const $ = this;

        this.StatementValue = [
            // {ALT: () => $.SUBRULE($[OvsSyntaxName.OvsDomRenderStatement])},
            {ALT: () => $.SUBRULE($.Block)},
            {ALT: () => $.SUBRULE($[Es6SyntaxName.ClassDeclaration])},
            {ALT: () => $.SUBRULE($[Es6SyntaxName.ExportDefaultStatement])},
            {ALT: () => $.SUBRULE($[Es6SyntaxName.ExportStatement])},
            {ALT: () => $.SUBRULE($[Es5SyntaxName.VariableStatement])},
            {ALT: () => $.SUBRULE($.EmptyStatement)},
            // "LabelledStatement" must appear before "ExpressionStatement" due to common lookahead prefix ("inner :" vs "inner")
            {ALT: () => $.SUBRULE($.LabelledStatement)},
            // The ambiguity is resolved by the ordering of the alternatives
            // See: https://ecma-international.org/ecma-262/5.1/#sec-12.4
            //   - [lookahead ∉ {{, function}]
            {
                ALT: () => $.SUBRULE($.ExpressionStatement),
                IGNORE_AMBIGUITIES: true,
            },
            {ALT: () => $.SUBRULE($.IfStatement)},
            {ALT: () => $.SUBRULE($.IterationStatement)},
            {ALT: () => $.SUBRULE($.ContinueStatement)},
            {ALT: () => $.SUBRULE($.BreakStatement)},
            {ALT: () => $.SUBRULE($.ReturnStatement)},
            {ALT: () => $.SUBRULE($.WithStatement)},
            {ALT: () => $.SUBRULE($.SwitchStatement)},
            {ALT: () => $.SUBRULE($.ThrowStatement)},
            {ALT: () => $.SUBRULE($.TryStatement)},
            {ALT: () => $.SUBRULE($.DebuggerStatement)},
        ]

        $.OVERRIDE_RULE(Es5SyntaxName.Statement, () => {
            $.OR(this.StatementValue);
        });

        // ES6 新增的语法规则
        // 块级作用域和变量声明
        $.OVERRIDE_RULE(Es5SyntaxName.VariableStatement, () => {
            $.OR([
                // { ALT: () => $.CONSUME(es6AllTokens.LetTok) },
                {ALT: () => $.CONSUME(es6AllTokens.ConstTok)},
                {ALT: () => $.CONSUME(es6AllTokens.VarTok)}
            ]);
            $.SUBRULE($.VariableDeclarationList);
            $.CONSUME(es6AllTokens.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // 模块导出
        $.RULE(Es6SyntaxName.ExportStatement, () => {
            $.CONSUME(es6AllTokens.ExportTok);
            $.OR([
                // { ALT: () => $.SUBRULE($.ExportClause) },
                {ALT: () => $.SUBRULE($[Es5SyntaxName.VariableStatement])},
                // { ALT: () => $.CONSUME(es6AllTokens.DefaultTok) }
            ]);
            $.CONSUME(es6AllTokens.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // 模块导出
        $.RULE(Es6SyntaxName.ExportDefaultStatement, () => {
            $.CONSUME(es6AllTokens.ExportTok);
            $.CONSUME(es6AllTokens.DefaultTok)
            $.OR([
                {ALT: () =>  $.SUBRULE($[Es6SyntaxName.ClassDeclaration])},
                {ALT: () =>  $.SUBRULE($[Es5SyntaxName.AssignmentExpression])},
            ]);
            $.CONSUME(es6AllTokens.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        $.RULE("ExportDeclaration", () => {
            $.CONSUME(es6AllTokens.ExportTok);
            $.OR([
                {ALT: () => $.SUBRULE($.ExportClause)},
                {ALT: () => $.SUBRULE($[Es5SyntaxName.VariableDeclaration])},
                {ALT: () => $.CONSUME(es6AllTokens.DefaultTok)}
            ]);
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

        $.OVERRIDE_RULE(Es5SyntaxName.PropertyAssignment, () => {
            $.OR([
                {ALT: () => $.SUBRULE($[Es6SyntaxName.ConciseMethodAssignment])},
                {ALT: () => $.SUBRULE($.RegularPropertyAssignment)},
                {ALT: () => $.SUBRULE($.GetPropertyAssignment)},
                {ALT: () => $.SUBRULE($.SetPropertyAssignment)},
            ]);
        });

        $.RULE(Es6SyntaxName.ConciseMethodAssignment, () => {
            $.SUBRULE($.PropertyName);
            $.CONSUME(t.LParen);
            $.OPTION(() => {
                $.SUBRULE($.FormalParameterList);
            });
            $.CONSUME(t.RParen);
            $.CONSUME(t.LCurly);
            $.SUBRULE($.SourceElements); // FunctionBody(clause 13) is equivalent to SourceElements
            $.CONSUME(t.RCurly);
        });

        // 类声明
        $.RULE(Es6SyntaxName.ClassDeclaration, () => {
            $.CONSUME(es6AllTokens.ClassTok);
            $.CONSUME(es6AllTokens.Identifier);
            $.OPTION(() => {
                $.SUBRULE($.ClassHeritage);
            });
            $.SUBRULE($[Es6SyntaxName.ClassBody]);
        });

        $.RULE("ClassHeritage", () => {
            $.CONSUME(es6AllTokens.ExtendsTok);
            // $.SUBRULE($.LeftHandSideExpression);
        });

        $.RULE(Es6SyntaxName.ClassBody, () => {
            $.CONSUME(es6AllTokens.LCurly);
            $.MANY(() => {
                $.SUBRULE($.ClassElement);
            });
            $.CONSUME(es6AllTokens.RCurly);
        });

        $.RULE(Es6SyntaxName.ClassElement, () => {
            $.OPTION(() => {
                $.CONSUME(es6AllTokens.StaticTok);
            });
            $.SUBRULE($[Es6SyntaxName.MethodDefinition])
            // $.OR([
            //     { ALT: () => $.SUBRULE($.MethodDefinition) },
            //     { ALT: () => $.CONSUME(es6AllTokens.Semicolon) }
            // ]);
        });

        $.RULE(Es6SyntaxName.MethodDefinition, () => {
            $.SUBRULE($.PropertyName);
            $.CONSUME(es6AllTokens.LParen);
            $.OPTION1(() => {
                $.SUBRULE($.FormalParameterList);
            });
            $.CONSUME(es6AllTokens.RParen);
            $.CONSUME(es6AllTokens.LCurly);
            $.SUBRULE($.SourceElements);
            $.CONSUME(es6AllTokens.RCurly);
        });


        /*

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
