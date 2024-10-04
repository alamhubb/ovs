import {SourceFile} from "typescript";
import ChevrotainEcma5Cst from "../model/ChevrotainEcma5Cst";
import ChevrotainEcma5Ast from "../model/ChevrotainEcma5Ast";
import OvsChevrotainCstTransformer from "@/ovs/transform/transformChevrotain/OvsChevrotainCstTransformer";
import ProgrammerOvsTransformer from "@/ovs/transform/transformOvs/ProgrammerOvsTransformer";
import {parseCodeToOvsCst} from "./OvsChevrotainParser";
import {ovsGenerateAstToTsCode} from "@/ovs/parser/ovsTypescriptParser";
import "@/ovs/transform/transformOvs/VariableStatementOvsTransformer"
import "@/ovs/transform/transformEs6/ObjectLiteralEs6Transformer"

/**
 * convert ovs syntax code to typescript code
 * @param code
 */
export function ovsTransformToTsCode(code: string): string {
    // convert ovs code to ovs chevrotain cst
    const chevrotainEcma5Cst: ChevrotainEcma5Cst = parseCodeToOvsCst(code)
    // transform ovs chevrotain cst to ovs ast
    const chevrotainEcma5Ast: ChevrotainEcma5Ast = OvsChevrotainCstTransformer.transformOvsChevrotainCstToAst(chevrotainEcma5Cst)

    // transform ovs ast  to typescript ast
    const typescriptAst: SourceFile = ProgrammerOvsTransformer.transformOvsAstToTsAst(chevrotainEcma5Ast)

    console.log(JSON.stringify(typescriptAst))

    const typescriptCode: string = ovsGenerateAstToTsCode(typescriptAst)

    return typescriptCode
}

//需要得到渲染后的代码，通过ts执行得到的语法树，和执行后的结果
