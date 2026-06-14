const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generator = require("@babel/generator").default;
const t = require("@babel/types");
const template = require("@babel/template").default;

const code = `
// 二进制整数
var b = 0b11;
// 八进制整数
var o = 0o7;
// 十六进制整数
var x = 0x23;
// \\u \\x 字符串
const u = 'Hello\\u{000A}\u0009!\xe4\xbd\xa0\xe5\xa5\xbd\xe4\xb8\x96\xe7\x95\x8c';
//复杂的数式
for (var i = 0x2 * -0x21a + 0x1d6 * 0x7 + -0x8a6; i < 0x174a + 0x2 * -0x1362 + 0xfba; i++)
  c[i] = (0x1876030b0 + 0x17c14dad0 + -0x203750b80) * Math.abs(Math.sin(_$pJ.yhLwH(i, 0x10ce + 0x1735 + -0x2802))) | 0x1c51 + -0x776 + -0x13 * 0x119;
`

const ast = parser.parse(code);

const Myvisitor = {
    NumericLiteral(path){
        path.node.extra.raw = path.node.extra.rawValue.toString();
    },
    StringLiteral(path){
        let node = path.node;
        let str = node.extra.raw;
        str = str.substring(1,str.length - 1)
        let value = decodeURI(escape(str));
        node.value = value;
        node.extra.rawValue = `${value}`;
        node.extra.raw = `'${value}'`;
    }
}


traverse(ast, Myvisitor);
const output = generator(ast);
console.log(output);
