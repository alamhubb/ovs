import {createToken} from "@/chevotain/src/scan/tokens_public.ts";
import {Lexer} from "@/chevotain/src/scan/lexer_public.ts";
import {CstParser} from "@/chevotain/src/parse/parser/parser.ts";

const Identifier = createToken({ name: "Identifier", pattern: /[a-zA-Z]\w*/ });
const left = createToken({ name: "left", pattern: /\(/ });
// We specify the "longer_alt" property to resolve keywords vs identifiers ambiguity.
// See: https://github.com/chevrotain/chevrotain/blob/master/examples/lexer/keywords_vs_identifiers/keywords_vs_identifiers.js
const Select = createToken({
    name: "Select",
    pattern: /SELECT/,
    longer_alt: Identifier,
});
const From = createToken({
    name: "From",
    pattern: /FROM/,
    longer_alt: Identifier,
});
const Where = createToken({
    name: "Where",
    pattern: /WHERE/,
    longer_alt: Identifier,
});

const Comma = createToken({ name: "Comma", pattern: /,/ });

const Integer = createToken({ name: "Integer", pattern: /0|[1-9]\d*/ });

const GreaterThan = createToken({ name: "GreaterThan", pattern: />/ });

const LessThan = createToken({ name: "LessThan", pattern: /</ });

const WhiteSpace = createToken({
    name: "WhiteSpace",
    pattern: /\s+/,
    group: Lexer.SKIPPED,
});

// note we are placing WhiteSpace first as it is very common thus it will speed up the lexer.
let allTokens = [
    WhiteSpace,
    // "keywords" appear before the Identifier
    Select,
    left,
    From,
    Where,
    Comma,
    // The Identifier must appear after the keywords because all keywords are valid identifiers.
    Identifier,
    Integer,
    GreaterThan,
    LessThan,
];
let SelectLexer = new Lexer(allTokens);

class SelectParser extends CstParser {
    constructor() {
        super(allTokens);

        const $ = this;

        $.RULE("selectStatement", () => {
            $.SUBRULE($.selectClause);
            $.SUBRULE($.divTest);
            $.SUBRULE($.fromClause);
            $.OPTION(() => {
                $.SUBRULE($.whereClause);
            });
        });

        $.RULE("divTest", () => {
            $.CONSUME(Identifier);
            $.CONSUME(left);
        });


        $.RULE("selectClause", () => {
            $.CONSUME(Select);
            $.AT_LEAST_ONE_SEP({
                SEP: Comma,
                DEF: () => {
                    $.CONSUME(Identifier);
                },
            });
        });


        $.RULE("fromClause", () => {
            $.CONSUME(From);
            $.CONSUME(Identifier);
        });

        $.RULE("whereClause", () => {
            $.CONSUME(Where);
            $.SUBRULE($.expression);
        });

        // The "rhs" and "lhs" (Right/Left Hand Side) labels will provide easy
        // to use names during CST Visitor (step 3a).
        $.RULE("expression", () => {
            $.SUBRULE($.atomicExpression, { LABEL: "lhs" });
            $.SUBRULE($.relationalOperator);
            $.SUBRULE2($.atomicExpression, { LABEL: "rhs" }); // note the '2' suffix to distinguish
            // from the 'SUBRULE(atomicExpression)'
            // 2 lines above.
        });

        $.RULE("atomicExpression", () => {
            $.OR([
                { ALT: () => $.CONSUME(Integer) },
                { ALT: () => $.CONSUME(Identifier) },
            ]);
        });

        $.RULE("relationalOperator", () => {
            $.OR([
                { ALT: () => $.CONSUME(GreaterThan) },
                { ALT: () => $.CONSUME(LessThan) },
            ]);
        });

        this.performSelfAnalysis();
    }
}
// ONLY ONCE
const parser = new SelectParser();

function parseInput(text) {
    const lexingResult = SelectLexer.tokenize(text);

    console.log(lexingResult.tokens)

    // "input" is a setter which will reset the parser's state.
    parser.input = lexingResult.tokens;

    // console.log(lexingResult.tokens)
    const res = parser.selectStatement();

    console.log(res)
    // if (parser.errors.length > 0) {
    //     throw new Error("sad sad panda, Parsing errors detected");
    // }
}

const inputText = "SELECT column1 div( FROM table2 WHERE 1<1";
parseInput(inputText);
