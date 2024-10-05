import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {ovsToTsTokenEs5SyntaxMap} from "@/ovs/transform/transformEs5/VariableStatementOvsChevrotainEs5Transformer";
import {Es5TokenName} from "@/grammars/ecma5/ecma5_tokens";

export default class IdentifierTransformer {
    static transformIdentifier(identifier: ChevrotainEcma5Ast) {
        return {
            kind: ovsToTsTokenEs5SyntaxMap.get(Es5TokenName.Identifier),
            escapedText: identifier.image
        }
    }
}