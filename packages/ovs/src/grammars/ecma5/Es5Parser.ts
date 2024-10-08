import {EOF, tokenMatcher, MismatchedTokenException, CstParser} from "@/chevrotain/src/api";
import * as t from "./ecma5_tokens.ts";


// console.log(tokenIndexMap.get(36))

export enum Es5SyntaxName {
    Program = 'Program',
    SourceElements = 'SourceElements',
    Statement = 'Statement',
    ElementList = 'ElementList',
    ObjectLiteral = 'ObjectLiteral',
    Arguments = 'Arguments',
    VariableDeclarationList = 'VariableDeclarationList',
    VariableDeclaration = 'VariableDeclaration',
    VariableStatement = 'VariableStatement',
    Initialiser = 'Initialiser',
    AssignmentExpression = 'AssignmentExpression',
    Expression = 'Expression',
    RegularPropertyAssignment = 'RegularPropertyAssignment',
    PropertyAssignment = 'PropertyAssignment',
    PropertyName = 'PropertyName',
    ReturnStatement = 'ReturnStatement',
}

export const ENABLE_SEMICOLON_INSERTION = true;
export const DISABLE_SEMICOLON_INSERTION = false;

// as defined in https://www.ecma-international.org/ecma-262/5.1/index.html
export class Es5Parser extends CstParser {
    set orgText(newText) {
        this._orgText = newText;
    }

    constructor() {
        super(t, {
            // Reduces Parser Initialization time and this grammar does not need
            // a larger lookahead.
            maxLookahead: 2,
        });

        // Optimization to avoid traversing the prototype chain at hotspots.
        this.SUPER_CONSUME = super.CONSUME;
        this.SUPER_CONSUME2 = super.CONSUME2;

        this._orgText = "";

        // to avoid V8 hidden class changes by dynamic definition
        // of properties on "this"
        this.c1 = undefined;
        this.c2 = undefined;
        this.c3 = undefined;
        this.c4 = undefined;
        this.c5 = undefined;

        const $ = this;

        // A.3 Expressions
        // Note that the binary expression operators are treated as a flat list
        // instead of using a new rule for each precedence level.
        // This is both faster and less verbose but it means additional logic must be used to re-order the flat list
        // into a precedence tree.
        // This approach was used in the swift compiler.
        // https://developer.apple.com/library/content/documentation/Swift/Conceptual/Swift_Programming_Language/Expressions.html#//apple_ref/doc/uid/TP40014097-CH32-ID383
        // (scroll down to the note on binary expressions)

        // Also note that such logic can only be implemented once the parser actually outputs some data structure...

        // See 11.1
        $.RULE("PrimaryExpression", () => {
            $.OR(
                $.c5 ||
                ($.c5 = [
                    {ALT: () => $.CONSUME(t.ThisTok)},
                    {ALT: () => $.CONSUME(t.Identifier)},
                    {ALT: () => $.CONSUME(t.AbsLiteral)},
                    {ALT: () => $.SUBRULE($.ArrayLiteral)},
                    {ALT: () => $.SUBRULE($[Es5SyntaxName.ObjectLiteral])},
                    {ALT: () => $.SUBRULE($.ParenthesisExpression)},
                ]),
            );
        });

        $.RULE("ParenthesisExpression", () => {
            $.CONSUME(t.LParen);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RParen);
        });

        // See 11.1.4
        $.RULE("ArrayLiteral", () => {
            $.CONSUME(t.LBracket);
            $.MANY(() => {
                $.OR([
                    // TODO: fix ambiguities with commas
                    // TODO2: WHICH AMBIGUITIES?! :)
                    {ALT: () => $.SUBRULE($[Es5SyntaxName.ElementList])},
                    {ALT: () => $.SUBRULE($.Elision)},
                ]);
            });
            $.CONSUME(t.RBracket);
        });

        // See 11.1.4
        $.RULE(Es5SyntaxName.ElementList, () => {
            // in the spec this may start with an optional Elision,
            // this create an ambiguity in the ArrayLiteral rule.
            // removing the Elision from this here does not modify the grammar
            // as the ElementList rule is only invoked from ArrayLiteral rule
            $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
            $.MANY(() => {
                $.SUBRULE2($.Elision);
                $.SUBRULE2($[Es5SyntaxName.AssignmentExpression]);
            });
        });

        // See 11.1.4
        $.RULE("Elision", () => {
            $.AT_LEAST_ONE(() => {
                $.CONSUME(t.Comma);
            });
        });

        // See 11.1.5
        // this inlines PropertyNameAndValueList
        $.RULE(Es5SyntaxName.ObjectLiteral, () => {
            $.CONSUME(t.LCurly);
            $.OPTION(() => {
                $.SUBRULE($[Es5SyntaxName.PropertyAssignment]);
                $.MANY(() => {
                    $.CONSUME(t.Comma);
                    $.SUBRULE2($[Es5SyntaxName.PropertyAssignment]);
                });
                $.OPTION2(() => {
                    $.CONSUME2(t.Comma);
                });
            });
            $.CONSUME(t.RCurly);
        });

        // See 11.1.5
        $.RULE(Es5SyntaxName.PropertyAssignment, () => {
            $.OR([
                {ALT: () => $.SUBRULE($.RegularPropertyAssignment)},
                {ALT: () => $.SUBRULE($.GetPropertyAssignment)},
                {ALT: () => $.SUBRULE($.SetPropertyAssignment)},
            ]);
        });

        $.RULE("RegularPropertyAssignment", () => {
            $.SUBRULE($[Es5SyntaxName.PropertyName]);
            $.CONSUME(t.Colon);
            $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
        });

        $.RULE("GetPropertyAssignment", () => {
            $.CONSUME(t.GetTok);
            $.SUBRULE($[Es5SyntaxName.PropertyName]);
            $.CONSUME(t.LParen);
            $.CONSUME(t.RParen);
            $.CONSUME(t.LCurly);
            $.SUBRULE($[Es5SyntaxName.SourceElements]); // FunctionBody(clause 13) is equivalent to SourceElements
            $.CONSUME(t.RCurly);
        });

        $.RULE("SetPropertyAssignment", () => {
            $.CONSUME(t.SetTok);
            $.SUBRULE($[Es5SyntaxName.PropertyName]);
            $.CONSUME2(t.LParen);
            $.CONSUME(t.Identifier);
            $.CONSUME(t.RParen);
            $.CONSUME(t.LCurly);
            $.SUBRULE($[Es5SyntaxName.SourceElements]); // FunctionBody(clause 13) is equivalent to SourceElements
            $.CONSUME(t.RCurly);
        });

        // See 11.1.5
        // this inlines PropertySetParameterList
        $.RULE(Es5SyntaxName.PropertyName, () => {
            $.OR([
                {ALT: () => $.CONSUME(t.IdentifierName)},
                {ALT: () => $.CONSUME(t.StringLiteral)},
                {ALT: () => $.CONSUME(t.NumericLiteral)},
            ]);
        });

        // See 11.2  why many?todo
        // merging MemberExpression, NewExpression and CallExpression into one rule
        $.RULE("MemberCallNewExpression", () => {
            $.MANY(() => {
                $.CONSUME(t.NewTok);
            });

            $.OR([
                {ALT: () => $.SUBRULE($.PrimaryExpression)},
                {ALT: () => $.SUBRULE($.FunctionExpression)},
            ]);

            $.MANY2(() => {
                $.OR2([
                    {ALT: () => $.SUBRULE($.BoxMemberExpression)},
                    {ALT: () => $.SUBRULE($.DotMemberExpression)},
                    {ALT: () => $.SUBRULE($[Es5SyntaxName.Arguments])},
                ]);
            });
        });

        $.RULE("BoxMemberExpression", () => {
            $.CONSUME(t.LBracket);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RBracket);
        });

        $.RULE("DotMemberExpression", () => {
            $.CONSUME(t.Dot);
            $.CONSUME(t.IdentifierName);
        });

        // See 11.2
        // this inlines ArgumentList
        $.RULE(Es5SyntaxName.Arguments, () => {
            $.CONSUME(t.LParen);
            $.OPTION(() => {
                $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
                $.MANY(() => {
                    $.CONSUME(t.Comma);
                    $.SUBRULE2($[Es5SyntaxName.AssignmentExpression]);
                });
            });
            $.CONSUME(t.RParen);
        });

        // See 11.3 Self-operation
        $.RULE("PostfixExpression", () => {
            // LHSExpression(see 11.2) is identical to MemberCallNewExpression
            $.SUBRULE($.MemberCallNewExpression);
            $.OPTION({
                GATE: this.noLineTerminatorHere,
                DEF: () => {
                    $.OR([
                        {ALT: () => $.CONSUME(t.PlusPlus)},
                        {ALT: () => $.CONSUME(t.MinusMinus)},
                    ]);
                },
            });
        });

        // See 11.4 Self-operation
        $.RULE("UnaryExpression", () => {
            $.OR([
                {ALT: () => $.SUBRULE($.PostfixExpression)},
                {
                    ALT: () => {
                        $.OR2(
                            $.c1 ||
                            ($.c1 = [
                                {ALT: () => $.CONSUME(t.DeleteTok)},
                                {ALT: () => $.CONSUME(t.VoidTok)},
                                {ALT: () => $.CONSUME(t.TypeOfTok)},
                                {ALT: () => $.CONSUME(t.PlusPlus)},
                                {ALT: () => $.CONSUME(t.MinusMinus)},
                                {ALT: () => $.CONSUME(t.Plus)},
                                {ALT: () => $.CONSUME(t.Minus)},
                                {ALT: () => $.CONSUME(t.Tilde)},
                                {ALT: () => $.CONSUME(t.Exclamation)},
                            ]),
                        );
                        $.SUBRULE($.UnaryExpression);
                    },
                },
            ]);
        });

        //Logical operations
        $.RULE("BinaryExpression", () => {
            $.SUBRULE($.UnaryExpression);
            $.MANY(() => {
                $.OR(
                    $.c3 ||
                    ($.c3 = [
                        // flat list of binary operators
                        {ALT: () => $.CONSUME(t.AbsAssignmentOperator)},
                        {ALT: () => $.CONSUME(t.VerticalBarVerticalBar)},
                        {ALT: () => $.CONSUME(t.AmpersandAmpersand)},
                        {ALT: () => $.CONSUME(t.VerticalBar)},
                        {ALT: () => $.CONSUME(t.Circumflex)},
                        {ALT: () => $.CONSUME(t.Ampersand)},
                        {ALT: () => $.CONSUME(t.AbsEqualityOperator)},
                        {ALT: () => $.CONSUME(t.AbsRelationalOperator)},
                        {ALT: () => $.CONSUME(t.InstanceOfTok)},
                        {ALT: () => $.CONSUME(t.InTok)},
                        {ALT: () => $.CONSUME(t.AbsShiftOperator)},
                        {
                            ALT: () => $.CONSUME(t.AbsMultiplicativeOperator),
                        },
                        {ALT: () => $.CONSUME(t.AbsAdditiveOperator)},
                    ]),
                );
                $.SUBRULE2($.UnaryExpression);
            });
        });

        $.RULE("BinaryExpressionNoIn", () => {
            $.SUBRULE($.UnaryExpression);
            $.MANY(() => {
                $.OR(
                    $.c4 ||
                    ($.c4 = [
                        // flat list of binary operators
                        {ALT: () => $.CONSUME(t.AbsAssignmentOperator)},
                        {ALT: () => $.CONSUME(t.VerticalBarVerticalBar)},
                        {ALT: () => $.CONSUME(t.AmpersandAmpersand)},
                        {ALT: () => $.CONSUME(t.VerticalBar)},
                        {ALT: () => $.CONSUME(t.Circumflex)},
                        {ALT: () => $.CONSUME(t.Ampersand)},
                        {ALT: () => $.CONSUME(t.AbsEqualityOperator)},
                        {ALT: () => $.CONSUME(t.AbsRelationalOperator)},
                        {ALT: () => $.CONSUME(t.InstanceOfTok)},
                        {ALT: () => $.CONSUME(t.AbsShiftOperator)},
                        {
                            ALT: () => $.CONSUME(t.AbsMultiplicativeOperator),
                        },
                        {ALT: () => $.CONSUME(t.AbsAdditiveOperator)},
                    ]),
                );
                $.SUBRULE2($.UnaryExpression);
            });
        });

        // See 11.13 Ternary Operation
        $.RULE(Es5SyntaxName.AssignmentExpression, () => {
            $.SUBRULE($.BinaryExpression);
            $.OPTION(() => {
                $.CONSUME(t.Question);
                $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
                $.CONSUME(t.Colon);
                $.SUBRULE2($[Es5SyntaxName.AssignmentExpression]);
            });
        });

        // See 11.13
        $.RULE("AssignmentExpressionNoIn", () => {
            $.SUBRULE($.BinaryExpressionNoIn);
            $.OPTION(() => {
                $.CONSUME(t.Question);
                $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
                $.CONSUME(t.Colon);
                $.SUBRULE2($.AssignmentExpressionNoIn);
            });
        });

        // See 11.14 many AssignmentExpression
        $.RULE(Es5SyntaxName.Expression, () => {
            $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
            $.MANY(() => {
                $.CONSUME(t.Comma);
                $.SUBRULE2($[Es5SyntaxName.AssignmentExpression]);
            });
        });

        // See 11.14
        $.RULE("ExpressionNoIn", () => {
            $.SUBRULE($.AssignmentExpressionNoIn);
            $.MANY(() => {
                $.CONSUME(t.Comma);
                $.SUBRULE2($.AssignmentExpressionNoIn);
            });
        });

        // A.4 Statements
        // See clause 12
        $.RULE(Es5SyntaxName.Statement, () => {
            $.OR(
                $.c2 ||
                ($.c2 = [
                    {ALT: () => $.SUBRULE($.Block)},
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
                    {ALT: () => $.SUBRULE($[Es5SyntaxName.ReturnStatement])},
                    {ALT: () => $.SUBRULE($.WithStatement)},
                    {ALT: () => $.SUBRULE($.SwitchStatement)},
                    {ALT: () => $.SUBRULE($.ThrowStatement)},
                    {ALT: () => $.SUBRULE($.TryStatement)},
                    {ALT: () => $.SUBRULE($.DebuggerStatement)},
                ])
            );
        });

        // See 12.1
        $.RULE("Block", () => {
            $.CONSUME(t.LCurly);
            $.OPTION(() => {
                $.SUBRULE($.StatementList);
            });
            $.CONSUME(t.RCurly);
        });

        // See 12.1
        $.RULE("StatementList", () => {
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.Statement);
            });
        });

        // See 12.2
        $.RULE(Es5SyntaxName.VariableStatement, () => {
            $.CONSUME(t.VarTok);
            $.SUBRULE($[Es5SyntaxName.VariableDeclarationList]);
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // See 12.2
        $.RULE(Es5SyntaxName.VariableDeclarationList, () => {
            $.SUBRULE($[Es5SyntaxName.VariableDeclaration]);
            $.MANY(() => {
                $.CONSUME(t.Comma);
                $.SUBRULE2($[Es5SyntaxName.VariableDeclaration]);
            });
        });

        //// See 12.2
        $.RULE("VariableDeclarationListNoIn", () => {
            // needed to distinguish between for and for-in
            let numOfVars = 1;
            $.SUBRULE($.VariableDeclarationNoIn);
            $.MANY(() => {
                $.CONSUME(t.Comma);
                $.SUBRULE2($.VariableDeclarationNoIn);
                numOfVars++;
            });
            return numOfVars;
        });

        // See 12.2
        $.RULE(Es5SyntaxName.VariableDeclaration, () => {
            $.CONSUME(t.Identifier);
            $.OPTION(() => {
                $.SUBRULE($[Es5SyntaxName.Initialiser]);
            });
        });

        //// See 12.2
        $.RULE("VariableDeclarationNoIn", () => {
            $.CONSUME(t.Identifier);
            $.OPTION(() => {
                $.SUBRULE($.InitialiserNoIn);
            });
        });

        // See 12.2
        $.RULE(Es5SyntaxName.Initialiser, () => {
            $.CONSUME(t.Eq);
            $.SUBRULE($[Es5SyntaxName.AssignmentExpression]);
        });

        // See 12.2
        $.RULE("InitialiserNoIn", () => {
            $.CONSUME(t.Eq);
            $.SUBRULE($.AssignmentExpressionNoIn);
        });

        // See 12.3
        $.RULE("EmptyStatement", () => {
            //  a semicolon is never inserted automatically if the semicolon would then be parsed as an empty statement
            $.CONSUME(t.Semicolon, DISABLE_SEMICOLON_INSERTION);
        });

        // See 12.4
        $.RULE("ExpressionStatement", () => {
            // the spec defines [lookahead ? {{, function}] to avoid some ambiguities, however those ambiguities only exist
            // because in a BNF grammar there is no priority between alternatives. This implementation however, is deterministic
            // the first alternative found to match will be taken. thus these ambiguities can be resolved
            // by ordering the alternatives
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // See 12.5
        $.RULE("IfStatement", () => {
            $.CONSUME(t.IfTok);
            $.CONSUME(t.LParen);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RParen);
            $.SUBRULE($.Statement);
            // refactoring spec to use an OPTION production for the 'else'
            // to resolve the dangling if-else problem
            $.OPTION(() => {
                $.CONSUME(t.ElseTok);
                $.SUBRULE2($.Statement);
            });
        });

        // See 12.6
        $.RULE("IterationStatement", () => {
            // the original spec rule has been refactored into 3 smaller ones
            $.OR([
                {ALT: () => $.SUBRULE($.DoIteration)},
                {ALT: () => $.SUBRULE($.WhileIteration)},
                {ALT: () => $.SUBRULE($.ForIteration)},
            ]);
        });

        $.RULE("DoIteration", () => {
            $.CONSUME(t.DoTok);
            $.SUBRULE($.Statement);
            $.CONSUME(t.WhileTok);
            $.CONSUME(t.LParen);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RParen);
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        $.RULE("WhileIteration", () => {
            $.CONSUME(t.WhileTok);
            $.CONSUME(t.LParen);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RParen);
            $.SUBRULE($.Statement);
        });

        $.RULE("ForIteration", () => {
            let inPossible = false;

            $.CONSUME(t.ForTok);
            $.CONSUME(t.LParen);
            $.OR([
                {
                    ALT: () => {
                        $.CONSUME(t.VarTok);
                        const numOfVars = $.SUBRULE($.VariableDeclarationListNoIn);
                        // 'in' is only possible if there was just one VarDec
                        // TODO: when CST output is enabled this check breaks
                        inPossible = numOfVars === 1;
                        $.SUBRULE($.ForHeaderParts, {ARGS: [inPossible]});
                    },
                },
                {
                    ALT: () => {
                        $.OPTION(() => {
                            const headerExp = $.SUBRULE($.ExpressionNoIn);
                            inPossible = this.canInComeAfterExp(headerExp);
                        });
                        $.SUBRULE2($.ForHeaderParts, {ARGS: [inPossible]});
                    },
                },
            ]);
            $.CONSUME(t.RParen);
            $.SUBRULE($.Statement);
        });

        $.RULE(
            "ForHeaderParts",
            /**
             * @param inPossible whether or not the second alternative starting with InTok is available in
             *        the current context. note that this means the grammar is not context free.
             *        however the only other alternative is to use backtracking which is even worse.
             */
            (inPossible) => {
                $.OR([
                    {
                        ALT: () => {
                            // no semicolon insertion in for header
                            $.CONSUME(t.Semicolon, DISABLE_SEMICOLON_INSERTION);
                            $.OPTION(() => {
                                $.SUBRULE($[Es5SyntaxName.Expression]);
                            });
                            // no semicolon insertion in for header
                            $.CONSUME2(t.Semicolon, DISABLE_SEMICOLON_INSERTION);
                            $.OPTION2(() => {
                                $.SUBRULE2($[Es5SyntaxName.Expression]);
                            });
                        },
                    },
                    {
                        GATE: () => inPossible,
                        ALT: () => {
                            $.CONSUME(t.InTok);
                            $.SUBRULE3($[Es5SyntaxName.Expression]);
                        },
                    },
                ]);
            },
        );

        // See 12.7
        $.RULE("ContinueStatement", () => {
            $.CONSUME(t.ContinueTok);
            $.OPTION({
                GATE: this.noLineTerminatorHere,
                DEF: () => {
                    $.CONSUME(t.Identifier);
                },
            });
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // See 12.8
        $.RULE("BreakStatement", () => {
            $.CONSUME(t.BreakTok);
            $.OPTION({
                GATE: this.noLineTerminatorHere,
                DEF: () => {
                    $.CONSUME(t.Identifier);
                },
            });
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // See 12.9
        $.RULE(Es5SyntaxName.ReturnStatement, () => {
            $.CONSUME(t.ReturnTok);
            $.OPTION({
                GATE: this.noLineTerminatorHere,
                DEF: () => {
                    $.SUBRULE($[Es5SyntaxName.Expression]);
                },
            });
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // See 12.10
        $.RULE("WithStatement", () => {
            $.CONSUME(t.WithTok);
            $.CONSUME(t.LParen);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RParen);
            $.SUBRULE($.Statement);
        });

        // See 12.11
        $.RULE("SwitchStatement", () => {
            $.CONSUME(t.SwitchTok);
            $.CONSUME(t.LParen);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.RParen);
            $.SUBRULE($.CaseBlock);
        });

        // See 12.11
        $.RULE("CaseBlock", () => {
            $.CONSUME(t.LCurly);
            $.OPTION(() => {
                $.SUBRULE($.CaseClauses);
            });
            $.OPTION2(() => {
                $.SUBRULE($.DefaultClause);
            });
            $.OPTION3(() => {
                $.SUBRULE2($.CaseClauses);
            });
            $.CONSUME(t.RCurly);
        });

        // See 12.11
        $.RULE("CaseClauses", () => {
            $.AT_LEAST_ONE(() => {
                $.SUBRULE($.CaseClause);
            });
        });

        // See 12.11
        $.RULE("CaseClause", () => {
            $.CONSUME(t.CaseTok);
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.Colon);
            $.OPTION(() => {
                $.SUBRULE($.StatementList);
            });
        });

        // See 12.11
        $.RULE("DefaultClause", () => {
            $.CONSUME(t.DefaultTok);
            $.CONSUME(t.Colon);
            $.OPTION(() => {
                $.SUBRULE($.StatementList);
            });
        });

        // See 12.12
        $.RULE("LabelledStatement", () => {
            $.CONSUME(t.Identifier);
            $.CONSUME(t.Colon);
            $.OPTION(() => {
                $.SUBRULE($.Statement);
            });
        });

        // See 12.13
        $.RULE("ThrowStatement", () => {
            $.CONSUME(t.ThrowTok);
            if (this.lineTerminatorHere()) {
                // this will trigger re-sync recover which is the desired behavior,
                // there is no danger of inRule recovery (single token insertion/deletion)
                // happening in this case because that type of recovery can only happen if CONSUME(...) was invoked.
                this.SAVE_ERROR(
                    new MismatchedTokenException(
                        "Line Terminator not allowed before Expression in Throw Statement",
                        // TODO: create line terminator token on the fly?
                    ),
                );
            }
            $.SUBRULE($[Es5SyntaxName.Expression]);
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // See 12.14
        $.RULE("TryStatement", () => {
            $.CONSUME(t.TryTok);
            $.SUBRULE($.Block);

            $.OR([
                {
                    ALT: () => {
                        $.SUBRULE($.Catch);
                        $.OPTION(() => {
                            $.SUBRULE($.Finally);
                        });
                    },
                },
                {ALT: () => $.SUBRULE2($.Finally)},
            ]);
        });

        // See 12.14
        $.RULE("Catch", () => {
            $.CONSUME(t.CatchTok);
            $.CONSUME(t.LParen);
            $.CONSUME(t.Identifier);
            $.CONSUME(t.RParen);
            $.SUBRULE($.Block);
        });

        // See 12.14
        $.RULE("Finally", () => {
            $.CONSUME(t.FinallyTok);
            $.SUBRULE($.Block);
        });

        // See 12.15
        $.RULE("DebuggerStatement", () => {
            $.CONSUME(t.DebuggerTok);
            $.CONSUME(t.Semicolon, ENABLE_SEMICOLON_INSERTION);
        });

        // A.5 Functions and Programs

        // See clause 13
        $.RULE("FunctionDeclaration", () => {
            $.CONSUME(t.FunctionTok);
            $.CONSUME(t.Identifier);
            $.CONSUME(t.LParen);
            $.OPTION(() => {
                $.SUBRULE($.FormalParameterList);
            });
            $.CONSUME(t.RParen);
            $.CONSUME(t.LCurly);
            $.SUBRULE($[Es5SyntaxName.SourceElements]); // FunctionBody(clause 13) is equivalent to SourceElements
            $.CONSUME(t.RCurly);
        });

        // See clause 13
        $.RULE("FunctionExpression", () => {
            $.CONSUME(t.FunctionTok);
            /*$.OPTION1(() => {
                $.CONSUME(t.Identifier);
            });*/
            $.CONSUME(t.LParen);
            $.OPTION(() => {
                $.SUBRULE($.FormalParameterList);
            });
            $.CONSUME(t.RParen);
            $.CONSUME(t.LCurly);
            $.SUBRULE($[Es5SyntaxName.SourceElements]); // FunctionBody(clause 13) is equivalent to SourceElements
            $.CONSUME(t.RCurly);
        });

        // See clause 13
        $.RULE("FormalParameterList", () => {
            $.CONSUME(t.Identifier);
            $.MANY(() => {
                $.CONSUME(t.Comma);
                $.CONSUME2(t.Identifier);
            });
        });

        // See clause 14
        $.RULE(Es5SyntaxName.Program, () => {
            $.SUBRULE($[Es5SyntaxName.SourceElements]);
        });

        // See clause 14
        // this inlines SourceElementRule rule from the spec
        $.RULE(Es5SyntaxName.SourceElements, () => {
            $.MANY(() => {
                $.OR([
                    // FunctionDeclaration appearing before statement implements [lookahead != {{, function}] in ExpressionStatement
                    // See https://www.ecma-international.org/ecma-262/5.1/index.html#sec-12.4Declaration
                    {
                        ALT: () => $.SUBRULE($.FunctionDeclaration),
                        IGNORE_AMBIGUITIES: true,
                    },
                    {ALT: () => $.SUBRULE($.Statement)},
                ]);
            });
        });

        // this.performSelfAnalysis();
    }

    /*
     * Link https://www.ecma-international.org/ecma-262/5.1/#sec-7.9.1
     * Automatic semicolon insertion implementation.
     * The spec defines the insertion in terms of encountering an "offending"
     * token and then inserting a semicolon under one of three basic rules.
     * 1. Offending token is after a lineTerminator.
     * 2. Offending token is a '}' RCurly.
     * 3. Reached EOF but failed to parse a complete ECMAScript Program.
     *
     * In addition there are two overriding conditions on these rules.
     * 1. do not insert if the semicolon would then be parsed as an empty statement.
     * 2. do not If that semicolon would become one of the two semicolons in the header of a for statement.
     *
     * The implementation approaches this problem in a slightly different but equivalent approach:
     *
     * anytime a semicolon should be consumed AND
     * the nextToken is not a semicolon AND
     * the context is one that allows semicolon insertion (not in a for header or empty Statement) AND
     * one of the 3 basic rules match
     * ---------------------------------->
     * THEN insert a semicolon
     *
     * Note that the context information is passed as the 'trySemiColonInsertion' argument
     * to the CONSUME parsing DSL method
     */
    canAndShouldDoSemiColonInsertion() {
        const nextToken = this.LA(1);
        const isNextTokenSemiColon = tokenMatcher(nextToken, t.Semicolon);
        return (
            isNextTokenSemiColon === false &&
            (this.lineTerminatorHere() || // basic rule 1a and 3
                tokenMatcher(nextToken, t.RCurly) || // basic rule 1b
                tokenMatcher(nextToken, EOF))
        ); // basic rule 2
    }

    // // TODO: performance: semicolon insertion costs 5-10% of runtime, can this be improved?
    CONSUME(tokClass, trySemiColonInsertion) {
        if (
            trySemiColonInsertion === true &&
            this.canAndShouldDoSemiColonInsertion()
        ) {
            return insertedSemiColon;
        }
        return this.SUPER_CONSUME(tokClass);
    }

    CONSUME2(tokClass, trySemiColonInsertion) {
        if (
            trySemiColonInsertion === true &&
            this.canAndShouldDoSemiColonInsertion()
        ) {
            return insertedSemiColon;
        }
        return this.SUPER_CONSUME2(tokClass);
    }

    // TODO: implement once the parser builds some data structure we can explore.
    // in the case of "for (x in y)" form.
    // the "IN" is only allowed if x is a left hand side expression
    // https://www.ecma-international.org/ecma-262/5.1/index.html#sec-12.6
    // so this method must verify that the exp parameter fulfills this condition.
    // eslint-disable-next-line no-unused-vars -- function signature
    canInComeAfterExp(exp) {
        // TODO: temp implementation, will always allow IN style iteration for now.
        return true;
    }

    noLineTerminatorHere() {
        return !this.lineTerminatorHere();
    }

    lineTerminatorHere() {
        const prevToken = this.LA(0);
        const nextToken = this.LA(1);
        const seekStart = prevToken.endOffset;
        const seekEnd = nextToken.startOffset - 1;

        let i = seekStart;
        while (i <= seekEnd) {
            const code = this._orgText.charCodeAt(i);
            if (code === 10 || code === 13 || code === 0x2028 || code === 0x2029) {
                return true;
            }
            i++;
        }
        return false;
    }
}

const insertedSemiColon = {
    tokenTypeIdx: t.Semicolon.tokenTypeIdx,
    image: ";",
    startOffset: NaN,
    endOffset: NaN,
    automaticallyInserted: true,
};
