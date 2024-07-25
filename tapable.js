import { SyncHook, AsyncParallelHook } from "tapable";

// webpack 的事件库
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook(["source", "target"]),
    };
  }
  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    return this.hooks.calculateRoutes.promise(source, target).then((res) => {
      console.log(res, 333);
      // res is undefined for AsyncParallelHook
    });
  }
  useNavigationSystemAsync(source, target, callback) {
    this.hooks.calculateRoutes.callAsync(source, target, (params) => {
      if (params) return callback(params);
      callback(null);
    });
  }
}

// 1.注册
const myCar = new Car();

myCar.hooks.accelerate.tap("accelerate", (newSpeed) => {
  console.log("accelerate");
  console.log(newSpeed);
});

myCar.hooks.calculateRoutes.tapPromise("GoogleMapsPlugin", (source, target) => {
  // return a promise
  return new Promise((resolve, reject) => {
    resolve(target);
  });
});
myCar.hooks.calculateRoutes.tapAsync(
  "BingMapsPlugin",
  (source, target, callback) => {
    setTimeout(() => {
      callback(222);
    });
  }
);

// You can still use sync plugins
// myCar.hooks.calculateRoutes.tap("CachedRoutesPlugin", (source, target) => {
//   console.log("CachedRoutesPlugin");
//   // return a value for AsyncParallelHook
//   return [source, target];
// });

// 2.触发

// myCar.setSpeed(100);
// myCar.useNavigationSystemPromise(1, 2).then(res=>{
// })
myCar.useNavigationSystemAsync(1, 2, (res) => {
  console.log("SystemAsync", res);
});
