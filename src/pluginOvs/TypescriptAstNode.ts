// 通过交叉类型组合固定属性和泛型的映射属性
export interface TypescriptAstNode<T> extends Record<keyof T, T[keyof T]> {
    pos: number;
    end: number;
    kind: number;
}

export interface TypescriptTextExtendAstNode {
    text: string
    escapedText: string
}

export interface ArgumentsExtendNode extends TypescriptTextExtendAstNode {
}

export interface ExpressionExtendNode extends TypescriptTextExtendAstNode {
    expression: TypescriptAstNode;
    arguments: TypescriptAstNode<ArgumentsExtendNode>[]
}

export interface DeclarationListExtendNode {
    declarations: TypescriptAstNode<DeclarationsExtendNode> []
}

export interface DeclarationsExtendNode {
    name: TypescriptAstNode<TypescriptTextExtendAstNode>;
    initializer: TypescriptAstNode<TypescriptTextExtendAstNode>
}

export interface StatementExtendNode {
    expression: TypescriptAstNode<ExpressionExtendNode>;
    declarationList: TypescriptAstNode<DeclarationListExtendNode> [];
}

