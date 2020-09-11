import {
	TransformerFactory,
	SourceFile,
	Node,
	isFunctionDeclaration,
	visitEachChild,
	visitNode,
} from "typescript";

const transformer: TransformerFactory<SourceFile> = ctx => {
	return sourceFile => {
		const visitor = (node: Node): Node => {
			
			return visitEachChild(node, visitor, ctx);
		};

		return visitNode(sourceFile, visitor);
	};
};

export default transformer;
