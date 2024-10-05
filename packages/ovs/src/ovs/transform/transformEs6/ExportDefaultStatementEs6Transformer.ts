import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import ExportDefaultClassDeclaration from "@/ovs/transform/transformEs6/ExportDefaultClassDeclaration";

export default class ExportDefaultStatementEs6Transformer {
    static transformExportDefaultStatement(exportDefaultStatement: ChevrotainEcma5Ast) {
        for (const child of exportDefaultStatement.children) {
            if (child.name === Es6SyntaxName.ClassDeclaration) {
                return ExportDefaultClassDeclaration.transformEs6ExportDefaultClass(exportDefaultStatement)
            }
        }
        throw new Error('错误路径')
    }
}