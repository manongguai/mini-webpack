import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import parser from "@babel/parser";
import traverse from "@babel/traverse";
import ejs from "ejs";
import babel from "@babel/core";
import { jsonLoader } from "./loader/json-loader.js";
import ChangeOutputPlugin from "./plugins/change-output.js";
import { SyncHook } from "tapable";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
var id = 1;

const webpackConfig = {
  module: {
    rules: [
      {
        test: /\.json$/,
        use: {
          // loader: path.resolve(__dirname, "loader/json-loader.js"),  // 文件格式
          loader: jsonLoader, // 函数形式
        },
      },
    ],
  },
  plugins: [new ChangeOutputPlugin()],
};

const hooks = {
  emitFile: new SyncHook(['context']),
};

function initPlugin() {
  webpackConfig.plugins.forEach((plugin) => {
    plugin.apply(hooks);
  });
}
initPlugin();
function createAssets(filePath) {
  // 1.获取文件内容
  let source = fs.readFileSync(path.join(__dirname, filePath), "utf8");
  // 加载loader
  const loaders = webpackConfig.module.rules;
  // 使用loader
  loaders.forEach((rule) => {
    const { test, use } = rule;
    if (test.test(filePath)) {
      if (Array.isArray(use.loader)) {
        use.loader.reverse.forEach((fn) => {
          source = fn(source);
        });
      } else {
        source = use.loader(source);
      }
    }
  });

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
  //  调用事件，传给插件，并携带上下文
  let outputPath = "./bundle.js";
  const context = {
    changeOutputPath(path) {
      outputPath = path;
    },
  };
  hooks.emitFile.call(context);
  fs.writeFileSync(outputPath, code);
}

build(graph);
