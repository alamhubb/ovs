import {createToken} from "@/chevotain/src/scan/tokens_public.ts";
import {Lexer} from "@/chevotain/src/scan/lexer_public.ts";
import {CstParser, EmbeddedActionsParser} from "@/chevotain/src/parse/parser/parser.ts";

const AdditionOperator = createToken({
    name: "AdditionOperator",
    pattern: Lexer.NA,
});
const Plus = createToken({
    name: "Plus",
    pattern: /\+/,
    categories: AdditionOperator,
});
const Minus = createToken({
    name: "Minus",
    pattern: /-/,
    categories: AdditionOperator,
});

const MultiplicationOperator = createToken({
    name: "MultiplicationOperator",
    pattern: Lexer.NA,
});
const Multi = createToken({
    name: "Multi",
    pattern: /\*/,
    categories: MultiplicationOperator,
});
const Div = createToken({
    name: "Div",
    pattern: /\//,
    categories: MultiplicationOperator,
});

const LParen = createToken({name: "LParen", pattern: /\(/});
const RParen = createToken({name: "RParen", pattern: /\)/});
const NumberLiteral = createToken({
    name: "NumberLiteral",
    pattern: /[1-9]\d*/,
});

const PowerFunc = createToken({name: "PowerFunc", pattern: /power/});
const Comma = createToken({name: "Comma", pattern: /,/});

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});

// whitespace is normally very common so it is placed first to speed up the lexer
const allTokens = [
    WhiteSpace,
    Plus,
    Minus,
    Multi,
    Div,
    LParen,
    RParen,
    NumberLiteral,
    AdditionOperator,
    MultiplicationOperator,
    PowerFunc,
    Comma,
];
export const CalculatorLexer = new Lexer(allTokens);

export class Calculator extends EmbeddedActionsParser {
    constructor() {
        super(allTokens);

        const $ = this;

        $.RULE("expression", () => {
            // uncomment the debugger statement and open dev tools in chrome/firefox
            // to debug the parsing flow.
            // debugger;
            return $.SUBRULE($.additionExpression);
        });

        // Lowest precedence thus it is first in the rule chain
        // The precedence of binary expressions is determined by
        // how far down the Parse Tree the binary expression appears.
        $.RULE("additionExpression", () => {
            let value, op, rhsVal;

            // parsing part
            value = $.SUBRULE($.multiplicationExpression);
            $.MANY(() => {
                // consuming 'AdditionOperator' will consume
                // either Plus or Minus as they are subclasses of AdditionOperator
                op = $.CONSUME(AdditionOperator);
                //  the index "2" in SUBRULE2 is needed to identify the unique
                // position in the grammar during runtime
                rhsVal = $.SUBRULE2($.multiplicationExpression);

                // interpreter part
                // tokenMatcher acts as ECMAScript instanceof operator
                if (tokenMatcher(op, Plus)) {
                    value += rhsVal;
                } else {
                    // op "instanceof" Minus
                    value -= rhsVal;
                }
            });

            return value;
        });

        $.RULE("multiplicationExpression", () => {
            let value, op, rhsVal;

            // parsing part
            value = $.SUBRULE($.atomicExpression);
            $.MANY(() => {
                op = $.CONSUME(MultiplicationOperator);
                //  the index "2" in SUBRULE2 is needed to identify the unique
                // position in the grammar during runtime
                rhsVal = $.SUBRULE2($.atomicExpression);

                // interpreter part
                // tokenMatcher acts as ECMAScript instanceof operator
                if (tokenMatcher(op, Multi)) {
                    value *= rhsVal;
                } else {
                    // op instanceof Div
                    value /= rhsVal;
                }
            });

            return value;
        });

        $.RULE("atomicExpression", () =>
            $.OR([
                // parenthesisExpression has the highest precedence and thus it
                // appears in the "lowest" leaf in the expression ParseTree.
                {ALT: () => $.SUBRULE($.parenthesisExpression)},
                {ALT: () => parseInt($.CONSUME(NumberLiteral).image, 10)},
                {ALT: () => $.SUBRULE($.powerFunction)},
            ])
        );

        $.RULE("parenthesisExpression", () => {
            let expValue;

            $.CONSUME(LParen);
            expValue = $.SUBRULE($.expression);
            $.CONSUME(RParen);

            return expValue;
        });

        $.RULE("powerFunction", () => {
            let base, exponent;

            $.CONSUME(PowerFunc);
            $.CONSUME(LParen);
            base = $.SUBRULE($.expression);
            $.CONSUME(Comma);
            exponent = $.SUBRULE2($.expression);
            $.CONSUME(RParen);

            return Math.pow(base, exponent);
        });

        // very important to call this after all the rules have been defined.
        // otherwise the parser may not work correctly as it will lack information
        // derived during the self analysis phase.
        this.performSelfAnalysis();
    }
}

