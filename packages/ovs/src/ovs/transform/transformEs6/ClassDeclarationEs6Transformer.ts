export default class ClassDeclarationEs6Transformer {
    static transformClassDeclaration(){
        return {
            "kind": 263, //ClassDeclaration
            "modifiers": [{
                "kind": 95 //ExportKeyword
            },
                {
                    "kind": 90 //DefaultKeyword
                }
            ],
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