import { SyncHook, AsyncParallelHook } from "tapable";

// webpack 的事件库
class Car {
  constructor() {
    this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      brake: new SyncHook(),
      calculateRoutes: new AsyncParallelHook([
        "source",
        "target",
      ]),
    };
  }
  setSpeed(newSpeed) {
    // following call returns undefined even when you returned values
    this.hooks.accelerate.call(newSpeed);
  }

  useNavigationSystemPromise(source, target) {
    return this.hooks.calculateRoutes
      .promise(source, target)
      .then((res) => {
        console.log(res,333);
        console.log(source,target);
        // res is undefined for AsyncParallelHook
      });
  }
  useNavigationSystemAsync(source, target, callback) {
    this.hooks.calculateRoutes.callAsync(source, target, (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }
}

// 1.注册
// 2.触发

const myCar = new Car();

myCar.hooks.accelerate.tap("accelerate", (newSpeed) => {
  console.log("accelerate");
  console.log(newSpeed);
});

myCar.setSpeed(100)
myCar.useNavigationSystemPromise(1,2)
myCar.useNavigationSystemAsync(1,2,()=>{
    console.log(222);
})
