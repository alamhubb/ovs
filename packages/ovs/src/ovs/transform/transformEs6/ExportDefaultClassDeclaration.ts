import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import Es6Transformer, {ovsToTsTokenEs6SyntaxMap} from "@/ovs/transform/transformEs6/Es6Transformer";
import {Es5TokenName} from "@/grammars/ecma5/ecma5_tokens";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";

export default class ExportDefaultClassDeclaration {
    static transformEs6ExportDefaultClass(exportDefaultStatement: ChevrotainEcma5Ast) {

        let modifiers = []

        const exportDefaultChildren = exportDefaultStatement.children

        let classAst = null
        for (const exportDefaultChild of exportDefaultChildren) {
            if (exportDefaultChild.name === Es6SyntaxName.ClassDeclaration) {
                classAst = Es6Transformer.transform(exportDefaultChild)
            } else if (exportDefaultChild.tokenTypeName === Es5TokenName.DefaultTok) {
                modifiers.push({
                    kind:ovsToTsTokenEs6SyntaxMap.get(Es5TokenName.DefaultTok)
                })
            } else if (exportDefaultChild.tokenTypeName === ES6TokenName.ExportTok) {
                modifiers.push({
                    kind:ovsToTsTokenEs6SyntaxMap.get(ES6TokenName.ExportTok)
                })
            }
        }

        if (!classAst){
            throw Error('错误语法')
        }

        return {
            ...classAst,
            modifiers:modifiers
        }

    }
}