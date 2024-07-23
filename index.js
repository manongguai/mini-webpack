import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import parser from "@babel/parser";
import traverse from "@babel/traverse";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createAssets() {
  // 1.获取文件内容
  const source = fs.readFileSync(
    path.join(__dirname, "example/main.js"),
    "utf8"
  );

  console.log(source);
  // 2.获取依赖关系
  // 抽象语法树
  const ast = parser.parse(source, {
    sourceType: "module",
  });
  // 遍历 AST，找到 import 语句
  console.log(ast);
  traverse.default(ast, {
    ImportDeclaration(data) {
        console.log(data);
    },
  })
  return {};
}

createAssets();
