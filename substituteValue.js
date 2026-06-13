const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const template = require("@babel/template").default;

const code = `
var a = 1, b = 2,h = 'hello,world';
b += 1;
let c = 3;
const d = 4;
let e = f(5, a, b, c, d);
let g = a + b + c;
consol.log(h);
`

const ast = parser.parse(code);

const splitNode = {
    VariableDeclaration(path) {
        let {kind, declarations} = path.node;

        if (declarations.length <= 1) {
            return;
        }

        let VariableDeclarationNodes = [];
        for (i of declarations) {
            VariableDeclarationNodes.push(t.variableDeclaration(kind, [i]));
        }

        path.replaceWithMultiple(VariableDeclarationNodes);
    }
}

traverse(ast, splitNode)

const subsituteValues = {
    VariableDeclarator(path) {
        let {scope, node} = path;
        let binding = scope.getBinding(node.id.name);
        let initNode = node.init
        // 只对“是常量“变量改动（未改变过值的量） ， 只对字面量改动（var a = 1; 或 var a = 'string'的量 ）
        if (binding.constant && t.isLiteral(initNode)) {
            for (let i of binding.referencePaths) {
                i.replaceWith(initNode);
            }
            path.remove();
        }

    }
};

traverse(ast, subsituteValues);
let output = generator(ast);
console.log(output);