(function (modules) { /* 模拟bundle的实现， cjs */ function require(id) { const
[fn, mapping] = modules[id]; const module = { exports: {}, }; function
localRequire(filePath) { const id = mapping[filePath]; return require(id); }
fn(localRequire, module, module.exports); return module.exports; } require(1);
/* log foo main */ })({  "1": [
function (require, module, exports) { "use strict";

var _foo = require("./foo.js");
var _bar = require("./utils/bar.js");
var _user = require("./user.json");
var _user2 = _interopRequireDefault(_user);
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
// 导入打印json文件， 需要loader处理
console.log(_user2.default);
(0, _foo.foo)(); // logs: 'foo'
console.log("main"); }, {"./foo.js":2,"./utils/bar.js":3,"./user.json":4} ],  "2": [
function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;
var _bar = require("./utils/bar.js");
function foo() {
  console.log('foo');
}
(0, _bar.bar)(); }, {"./utils/bar.js":3} ],  "3": [
function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;
function bar() {
  console.log("bar");
} }, {} ],  "4": [
function (require, module, exports) { "use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = "{\n  \"name\": \"张三\",\n  \"age\": 18\n}\n"; }, {} ],  });
