import {OvsChevrotainSyntaxDefine, OvsSyntaxName} from "../chervotainSyntaxDefine/OvsChevrotainSyntaxDefine.ts";
import {tokenize} from "../ecma5/ecma5_lexer.ts";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst.ts";
import ts, {Node, NodeArray, SourceFile, Statement} from "typescript";
import {Es5SyntaxName, tokenIndexMap} from "../ecma5/ecma5_parser.ts";
import ChevrotainEcma5Ast from "../model/ChevrotainEcma5Ast.ts";
import {
    ArgumentsExtendNode,
    DeclarationsExtendNode,
    StatementExtendNode,
    TypescriptAstNode, TypescriptTextExtendAstNode
} from "../TypescriptAstNode.ts";
import {Es5TokenName} from "../ecma5/ecma5_tokens.ts";

const ovsToTsTokenSyntaxMap: Map<string, number> = new Map()
ovsToTsTokenSyntaxMap.set(Es5TokenName.NumericLiteral, ts.SyntaxKind.NumericLiteral)
ovsToTsTokenSyntaxMap.set(Es5TokenName.Identifier, ts.SyntaxKind.Identifier)


/**
 * Convert string code to ovs Chevrotain cst
 * @param code
 */
export function parseToOvsChevrotainCst(code: string): ChevrotainEcma5Cst {
    const parserInstance = new OvsChevrotainSyntaxDefine();
    const tokens = tokenize(code);
    parserInstance.input = tokens;
    parserInstance.orgText = code;
    const cst = parserInstance.Program();
    if (parserInstance.errors.length > 0) {
        console.log(parserInstance.errors)
        throw Error("Sad Sad Panda");
    }
    return cst
}
