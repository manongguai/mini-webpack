(function (modules) {
  /* 
      模拟bundle的实现， cjs
    */
  function require(filePath) {
    const fn = modules[filePath];
    const module = {
      exports: {},
    };

    fn(require, module, module.exports);

    return module.exports;
  }

  require("./main.js");

  /* log 
    foo
    main
    */
})({
  // 第一版， 使用 filePath 去映射， 但会因为存在同名相对地址的原因导致无法查询
  "./foo.js": function (require, module, exports) {
    function foo() {
      console.log("foo");
    }
    module.exports = {
      foo,
    };
  },
  "./main.js": function (require, module, exports) {
    const { foo } = require("./foo.js");
    foo();
    console.log("main");
  },
});
