import { foo } from "./foo.js";
import { bar } from "./utils/bar.js";
import user from "./user.json";

// 导入打印json文件， 需要loader处理
console.log(user);
foo(); // logs: 'foo'
console.log("main");
