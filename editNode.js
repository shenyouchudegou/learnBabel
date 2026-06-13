const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const template = require("@babel/template").default;

const code = `
var a = 1, b = 2;
let c = 3;
const d = 4;
let e, f, g = function () { console.log('ggg'); };
g();
`

const ast = parser.parse(code);

const Myvisitor = {
    VariableDeclaration(path) {
        let {kind, declarations} = path.node;

        if (declarations.length <= 1){
            return;
        }

        let VariableDeclarationNodes = [];
        for(let i of declarations ){
            VariableDeclarationNodes.push(t.variableDeclaration(kind,[i]));
        }

        path.replaceWithMultiple(VariableDeclarationNodes);
    }
}

traverse(ast, Myvisitor);
const output = generator(ast);
console.log(output);
