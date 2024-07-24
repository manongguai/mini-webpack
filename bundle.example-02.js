(function (modules) {
  /* 
    模拟bundle的实现， cjs
  */
  function require(id) {
    const [fn, mapping] = modules[id];
    const module = {
      exports: {},
    };
    function localRequire(filePath) {
      const id = mapping[filePath];
      return require(id);
    }

    fn(localRequire, module, module.exports);

    return module.exports;
  }

  require(1);

  /* log 
  foo
  main
  */
})({
  // 第二版， 使用 id  和 每个graph内的mapping完成映射，避免重名问题
  1: [
    function (require, module, exports) {
      const { foo } = require("./example/foo.js");
      foo();
      console.log("main");
    },
    {
      "./foo.js": 2,
    },
  ],
  2: [
    function (require, module, exports) {
      function foo() {
        console.log("foo");
      }
      module.exports = {
        foo,
      };
    },
    {},
  ],
});
