import {SourceFile} from "typescript";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst";
import ChevrotainEcma5Ast from "../model/ChevrotainEcma5Ast";
import {parseToOvsChevrotainCst} from "../parser/ovsChevrotainParser";
import {transformOvsAstToTsAst, transformOvsChevrotainCstToAst} from "../parser/ovsChevrotainTransform";
import {ovsGenerateTsCode} from "../parser/ovsTsGenerator";

/**
 * convert ovs syntax code to typescript code
 * @param code
 */
export function ovsTransformToTsCode(code: string): string {
    // convert ovs code to ovs chevrotain cst
    const chevrotainEcma5Cst: ChevrotainEcma5Cst = parseToOvsChevrotainCst(code)
    // transform ovs chevrotain cst to ovs ast
    const chevrotainEcma5Ast: ChevrotainEcma5Ast = transformOvsChevrotainCstToAst(chevrotainEcma5Cst)
    // transform ovs ast  to typescript ast
    const typescriptAst: SourceFile = transformOvsAstToTsAst(chevrotainEcma5Ast)
    const typescriptCode: string = ovsGenerateTsCode(typescriptAst)
    return typescriptCode
}
