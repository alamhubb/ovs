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
 * Convert ovs Chevrotain cst to ast
 * @param programAst
 */
export function transformOvsAstToTsAst(programAst: ChevrotainEcma5Ast): SourceFile {
    if (chevrotainAst.name !== Es5SyntaxName.Program) {
        throw "解析错误"
    }
    const statements: Statement [] = []

    const sourceFile: SourceFile = {
        kind: ts.SyntaxKind.SourceFile,
        statements: statements,
        text: "",
        fileName: "_$$ovs$$temp$$ovsToTsAst.ts"
    }
    programAst.children.forEach(sourceElements => {
        sourceElements.children.forEach(statement => {
            const statementAst = transformStatementAst(statement)
            statements.push(statementAst)
        })
    })
    return sourceFile
}


/**
 * Convert ovs Chevrotain cst to ast
 * @param code
 */
export function transformOvsChevrotainCstToAst(cst: ChevrotainEcma5Cst): ChevrotainEcma5Ast {
    const ovsChevrotainAst = {...cst, children: []};

    if (ovsChevrotainAst.tokenTypeIdx) {
        ovsChevrotainAst.tokenType = tokenIndexMap.get(ovsChevrotainAst.tokenTypeIdx)
    }
    // {additionExpression:[]}
    const childObj = cst.children
    if (childObj) {
        //additionExpression:[]
        Object.keys(childObj).forEach((key) => {
            //additionExpression
            //对象属性的名字，这个属性对应的是个数组
            //数组，数组里面只有一个元素，
            //[]
            const keyValue = cst.children[key]
            //得到数组里面的这个对象
            //{name: 'additionExpression', children: {…}}
            keyValue.forEach(indexChild => {
                // {name,child}
                const transformChild = convertCstToChevrotainAst(indexChild)
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



function transformStatementAst(statementAst: ChevrotainEcma5Ast): Statement {
    let ast: TypescriptAstNode<StatementExtendNode> = {}
    const syntax = statementAst.children[0]
    if (syntax.name === OvsSyntaxName.OvsDomRenderStatement) {
        ast = transformOvsRenderDomAst(syntax);
    } else if (syntax.name === Es5SyntaxName.VariableStatement) {
        ast = transformVariableStatementAst(syntax);
    }
    return ast
}

//      EndOfFileToken = 1,
//      StringLiteral = 11,
//     Identifier = 80,
// ArrayLiteralExpression = 209,
// CallExpression = 213,
// ExpressionStatement = 244,
// SourceFile = 307,


function getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression: ChevrotainEcma5Ast): TypescriptAstNode<TypescriptTextExtendAstNode> {
    const primaryExpressionToken = assignmentExpression.children[0].children[0].children[0].children[0].children[0].children[0];

    if (primaryExpressionToken.tokenType === Es5TokenName.Identifier) {
        return {
            kind: ovsToTsTokenSyntaxMap.get(primaryExpressionToken.tokenType),
            escapedText: primaryExpressionToken.image
        }
    } else {
        return {
            kind: ovsToTsTokenSyntaxMap.get(primaryExpressionToken.tokenType),
            text: String(primaryExpressionToken.image)
        }
    }
}

function transformOvsRenderDomAst(syntax: ChevrotainEcma5Ast) {
    const argumentsAry: TypescriptAstNode<ArgumentsExtendNode>[] = []
    let ast: TypescriptAstNode<StatementExtendNode> = {
        kind: ts.SyntaxKind.ExpressionStatement,
        expression: {
            kind: ts.SyntaxKind.CallExpression,
            expression: {
                kind: ts.SyntaxKind.Identifier,
                escapedText: "h",
            },
            arguments: argumentsAry
        }
    }
    for (const syntaxToken of syntax.children) {
        if (syntaxToken.tokenType === Es5TokenName.Identifier) {
            //tagName 固定为 StringLiteral
            const argument: TypescriptAstNode<ArgumentsExtendNode> = {
                // pos: syntaxToken.startOffset,
                // end: syntaxToken.endOffset,
                kind: ts.SyntaxKind.StringLiteral,
                text: syntaxToken?.image,
            }
            argumentsAry.push(argument)
        } else if (syntaxToken.name === Es5SyntaxName.ElementList) {
            function assignmentExpressionGetToken(assignmentExpression: ChevrotainEcma5Ast) {
                //assignmentExpression.BinaryExpression. UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression.tokenType
                const token = getPrimaryExpressionTokenByAssignmentExpression(assignmentExpression)

                return token
            }

            let child
            if (syntaxToken.children.length > 1) {
                const elements = []
                child = {
                    kind: ts.SyntaxKind.ArrayLiteralExpression,
                    elements: elements
                }
                for (const assignmentExpression of syntaxToken.children) {
                    elements.push(assignmentExpressionGetToken(assignmentExpression))
                }
            } else {
                const assignmentExpression = syntaxToken.children[0]
                child = assignmentExpressionGetToken(assignmentExpression)
            }
            if (!argumentsAry.length) {
                throw "renderDom syntax error"
            }
            argumentsAry.push(child)
        }
    }
    return ast;
}


function transformVariableStatementAst(syntax: ChevrotainEcma5Ast) {


    let astKind
    let declarationList
    let declarations: TypescriptAstNode<DeclarationsExtendNode> [] = [];
    for (const tokenSyntax of syntax.children) {
        if (tokenSyntax.tokenType === Es5TokenName.VarTok) {
            astKind = ts.SyntaxKind.VariableStatement
        } else if (tokenSyntax.name === Es5SyntaxName.VariableDeclarationList) {
            //对应一条声明语句 variableDeclarationCst ,遍历 VariableDeclarationList
            for (const variableDeclarationCst of tokenSyntax.children) {
                // 遍历 VariableDeclaration
                if (variableDeclarationCst.name === Es5SyntaxName.VariableDeclaration) {
                    let name: TypescriptAstNode<TypescriptTextExtendAstNode> = null
                    let initializer: TypescriptAstNode<TypescriptTextExtendAstNode> = null
                    for (const variableDeclarationTokenSyntax of variableDeclarationCst.children) {
                        if (variableDeclarationTokenSyntax.tokenType === Es5TokenName.Identifier) {
                            name = {
                                kind: ovsToTsTokenSyntaxMap.get(variableDeclarationTokenSyntax.tokenType),
                                escapedText: variableDeclarationTokenSyntax.image
                            }
                            // 9 = NumericLiteral
                        } else if (variableDeclarationTokenSyntax.name === Es5SyntaxName.Initialiser) {
                            //AssignmentExpression.BinaryExpression.UnaryExpression.PostfixExpression.MemberCallNewExpression.PrimaryExpression
                            const assignmentExpressionCst = variableDeclarationTokenSyntax.children[1]
                            initializer = getPrimaryExpressionTokenByAssignmentExpression(assignmentExpressionCst)
                        }
                    }
                    const declaration: TypescriptAstNode<DeclarationsExtendNode> = {
                        kind: ts.SyntaxKind.VariableDeclaration,
                        name,
                        initializer
                    }
                    declarations.push(declaration)
                }
            }
        }
    }

    if (!astKind) {
        throw '错误的Kind'
    }

    if (!declarations.length) {
        throw '错误的' + Es5SyntaxName.VariableDeclarationList
    }

    let ast: TypescriptAstNode<StatementExtendNode> = {
        kind: astKind,
        declarationList: {
            kind: ts.SyntaxKind.VariableDeclarationList,
            declarations: declarations
        }
    }
    return ast
}
