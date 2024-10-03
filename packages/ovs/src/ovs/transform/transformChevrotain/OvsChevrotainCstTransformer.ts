import ChevrotainEcma5Cst from "../../model/ChevrotainEcma5Cst.ts";
import ts, {SourceFile, Statement} from "typescript";
import {Es5SyntaxName} from "../../../grammars/ecma5/ecma5_parser.ts";
import ChevrotainEcma5Ast from "../../model/ChevrotainEcma5Ast.ts";
import {
    ArgumentsExtendNode,
    DeclarationsExtendNode,
    StatementExtendNode,
    TypescriptAstNode, TypescriptTextExtendAstNode
} from "../../TypescriptAstNode.ts";
import {Es5TokenName} from "../../../grammars/ecma5/ecma5_tokens.ts";
import {ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import Es6TokenMap from "@/ovs/parser/Es6TokenMap";
import {parseCodeToOvsCst} from "@/ovs/parser/OvsChevrotainParser";


//      EndOfFileToken = 1,
//      StringLiteral = 11,
//     Identifier = 80,
// ArrayLiteralExpression = 209,
// CallExpression = 213,
// ExpressionStatement = 244,
// SourceFile = 307,


export default class OvsChevrotainCstTransformer {

    static transformCodeToAst(code: string) {
        const cst: ChevrotainEcma5Cst = parseCodeToOvsCst(code)
        const chevrotainEcma5Ast: ChevrotainEcma5Ast = OvsChevrotainCstTransformer.transformOvsChevrotainCstToAst(cst)

        // console.log(JSON.stringify(chevrotainEcma5Ast))
        return chevrotainEcma5Ast
    }

    static transformOvsChevrotainCstToAst(chevrotainEcma5Cst: ChevrotainEcma5Cst) {
        const chevrotainEcma5Ast: ChevrotainEcma5Ast = OvsChevrotainCstTransformer.transformOvsChevrotainCstToAstChild(chevrotainEcma5Cst)

        console.log(JSON.stringify(chevrotainEcma5Ast))
        return chevrotainEcma5Ast
    }

    /**
     * Convert ovs Chevrotain cst to ast
     * @param chevrotainEcma5Cst
     */
    static transformOvsChevrotainCstToAstChild(chevrotainEcma5Cst: ChevrotainEcma5Cst): ChevrotainEcma5Ast {
        const ovsChevrotainAst: ChevrotainEcma5Cst = {...chevrotainEcma5Cst, children: []};

        if (ovsChevrotainAst.tokenTypeIdx) {
            ovsChevrotainAst.tokenTypeName = Es6TokenMap.get(ovsChevrotainAst.tokenTypeIdx)
        }
        // {additionExpression:[]}
        const childObj = chevrotainEcma5Cst.children
        if (childObj) {
            //additionExpression:[]
            Object.keys(childObj).forEach((key) => {
                //additionExpression
                //对象属性的名字，这个属性对应的是个数组
                //数组，数组里面只有一个元素，
                //[]
                const keyValue = chevrotainEcma5Cst.children[key]
                //得到数组里面的这个对象
                //{name: 'additionExpression', children: {…}}
                keyValue.forEach(indexChild => {
                    // {name,child}
                    const transformChild = OvsChevrotainCstTransformer.transformOvsChevrotainCstToAstChild(indexChild)
                    // Object.keys(indexChild.children).forEach(realKey => {
                    //   const realChild = indexChild.children[realKey]
                    // const transformChild = transform(realKey, realChild[0], level + 1)
                    ovsChevrotainAst.children.push(transformChild)
                    // })
                })
            })
        }
        return ovsChevrotainAst;
    }
}
