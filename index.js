import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import ejs from "ejs";
import babel from "@babel/core";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var id = 1;
function createAssets(filePath) {
  // 1.获取文件内容
  const source = fs.readFileSync(path.join(__dirname, filePath), "utf8");

  // 2.获取依赖关系
  // 抽象语法树
  const ast = parser.parse(source, {
    sourceType: "module",
  });
  // 遍历 AST，找到 import 语句
  const deps = [];
  traverse.default(ast, {
    ImportDeclaration({ node }) {
      deps.push(node.source.value);
    },
  });
  //   转换为cjs
  const { code } = babel.transformFromAst(ast, null, {
    presets: ["env"],
  });
  return { code, deps, filePath, id: id++, mapping: {} };
}

// 创建依赖图
function createGraph(filePath) {
  // 获取文件所在路径
  const dirname = path.dirname(filePath);
  const mainAsset = createAssets(filePath);
  const queue = [mainAsset];

  function collectGraph(asset) {
    if (asset.deps.length) {
      asset.deps.forEach((relativePath) => {
        const depFilePath = path.join(dirname, relativePath);
        let child;
        const index = queue.findIndex((a) => {
          return a.filePath === depFilePath;
        });
        // 去重
        if (index != -1) {
          child = queue[index];
        } else {
          child = createAssets(depFilePath);
          queue.push(child);
        }
        asset.mapping[relativePath] = child.id;
        if (child.deps.length > 0) {
          collectGraph(child);
        }
      });
    }
    return queue;
  }
  collectGraph(mainAsset);
  return queue;
}
const graph = createGraph("example/main.js");

function build(graph) {
  const template = fs.readFileSync("./bundle.ejs", "utf8");

  const data = graph.map((asset) => {
    return {
      filePath: asset.filePath,
      code: asset.code,
      id: asset.id,
      mapping: asset.mapping,
    };
  });

  const code = ejs.render(template, {
    data,
  });
  fs.writeFileSync("./bundle.js", code);
}

build(graph);
