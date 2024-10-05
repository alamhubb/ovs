import ChevrotainEcma5Ast from "@/ovs/model/ChevrotainEcma5Ast";
import {Es5TokenName, ES6TokenName} from "@/grammars/es6/ECMAScript6Token";
import Es6TokenMap from "@/ovs/parser/Es6TokenMap";
import {ovsToTsTokenEs6SyntaxMap} from "@/ovs/transform/transformEs6/ProgrammerOvsEs6Transformer";
import {Es6SyntaxName} from "@/grammars/es6/ECMAScript6Parser";
import TransformerEs6 from "@/ovs/transform/transformEs6/TransformerEs6";

export default class ExportDefaultClassDeclaration {
    static transformEs6ExportDefaultClass(exportDefaultStatement: ChevrotainEcma5Ast) {

        let modifiers = []

        const exportDefaultChildren = exportDefaultStatement.children

        let classAst = null
        for (const exportDefaultChild of exportDefaultChildren) {
            if (exportDefaultChild.name === Es6SyntaxName.ClassDeclaration) {
                classAst = TransformerEs6.transform(exportDefaultChild)
            } else if (exportDefaultChild.tokenTypeName === Es5TokenName.DefaultTok) {
                modifiers.push(ovsToTsTokenEs6SyntaxMap.get(Es5TokenName.DefaultTok))
            } else if (exportDefaultChild.tokenTypeName === ES6TokenName.ExportTok) {
                modifiers.push(ovsToTsTokenEs6SyntaxMap.get(ES6TokenName.ExportTok))
            } else {

            }
        }

        let nameKind = {
            "kind": 80, //iden
            "escapedText": "Testsyntax"
        }

        let members = [{
            "kind": 174, //MethodDeclaration
            "modifiers": [{
                "kind": 126 //StaticKeyword
            }],
            "name": {
                "kind": 80, //iden
                "escapedText": "render"
            },
            "parameters": [],
            "body": {
                "kind": 241, //Block
                "statements": [{
                    "kind": 253, //ReturnStatement
                    "expression": {
                        "kind": 213,
                        "expression": {
                            "kind": 80,
                            "escapedText": "h"
                        },
                        "arguments": [{
                            "kind": 11,
                            "text": "div"
                        },
                            {
                                "kind": 9,
                                "text": "123"
                            }
                        ]
                    }
                }]
            }
        }]

        return {
            "kind": 263, //ClassDeclaration
            "modifiers": modifiers,
            "name": {
                "kind": 80, //iden
                "escapedText": "Testsyntax"
            },
            "members": [{
                "kind": 174, //MethodDeclaration
                "modifiers": [{
                    "kind": 126 //StaticKeyword
                }],
                "name": {
                    "kind": 80, //iden
                    "escapedText": "render"
                },
                "parameters": [],
                "body": {
                    "kind": 241, //Block
                    "statements": [{
                        "kind": 253, //ReturnStatement
                        "expression": {
                            "kind": 213,
                            "expression": {
                                "kind": 80,
                                "escapedText": "h"
                            },
                            "arguments": [{
                                "kind": 11,
                                "text": "div"
                            },
                                {
                                    "kind": 9,
                                    "text": "123"
                                }
                            ]
                        }
                    }]
                }
            }]
        }

    }
}