const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const template = require("@babel/template").default;

const node = `
var a = 1, b = 2, d, aa = 11;
let c = b + 3;
const f = 5;
console.log(aa);

function test_1() {
    console.log('I\\'m test_1.');
}

function test_2() {
    console.log('I\\'m test_2.');
}

function g() {
    var g = 1;
    g += 1;
    g += 1;
    console.log('g is ' + g)
}

test_2();
`;

const ast = parser.parse(node);

const splitNode = {
    VariableDeclaration(path) {
        let {kind, declarations} = path.node;

        if (declarations.length <= 1){
            return;
        }

        let VariableDeclarationNodes = [];
        for( i of declarations ){
            VariableDeclarationNodes.push(t.variableDeclaration(kind,[i]));
        }

        path.replaceWithMultiple(VariableDeclarationNodes);
    }
}

traverse(ast, splitNode)

const deleteNode = {
    VariableDeclarator(path) {
        let node = path.node;
        let name = node.id.name;
        let binding = path.scope.getBinding(name);

        if (binding.referenced){
            return;
        }
        path.remove();
    },
    FunctionDeclaration(path){
        let node = path.node;
        let name = node.id.name;
        let binding = path.parentPath.scope.getBinding(name);
        if (binding.referenced){
            return;
        }
        path.remove();
    }
}

traverse(ast, deleteNode);
var output = generator(ast);
console.log(output);