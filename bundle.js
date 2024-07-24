(function (modules) {
  /* 模拟bundle的实现， cjs */ function require(id) {
    const [fn, mapping] = modules[id];
    const module = { exports: {} };
    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }
    fn(localRequire, module, module.exports);
    return module.exports;
  }
  require(1);
  /* log foo main */
})({
  1: [
    function (require, module, exports) {
      "use strict";

      var _foo = require("./foo.js");
      var _bar = require("./utils/bar.js");
      (0, _foo.foo)(); // logs: 'foo'
      console.log("main");
    },
    { "./foo.js": 2, "./utils/bar.js": 3 },
  ],
  2: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.foo = foo;
      var _bar = require("./utils/bar.js");
      function foo() {
        console.log("foo");
      }
      (0, _bar.bar)();
    },
    { "./utils/bar.js": 3 },
  ],
  3: [
    function (require, module, exports) {
      "use strict";

      Object.defineProperty(exports, "__esModule", {
        value: true,
      });
      exports.bar = bar;
      function bar() {
        console.log("bar");
      }
    },
    {},
  ],
});
