# mini-webpack的实现 


## 一、createAssets
1. 首先需要读取文件的内容
2. 经由loader 将非js文件处理为js
3. 使用@babel/parser 把js 解析为ast
4. 使用@babel/traverse 获取 ast中的依赖关系， 得到deps
5. 使用babel.transformFromAst 将ast 转换为 cjs
   

## createGraph

1. 创建一个queue 
2. 收集图谱
3. 遍历主文件的deps
4. 在图谱中查询依赖的文件路径是否已经存在，存在则指向已存在的文件， 否则创建新的asset
5. 创建asset的 mapping依赖关系
6. 收集asset
   

## build
1. 创建bundle.ejs 模版文件
2. 将graph 关系映射到模板文件，生成bundle.js


## bundle.ejs

1. 创建自执行函数，接收modules参数
2. modules 函数为graph遍历所得，使用 assetId 作为键值， 对应一个函数和一个mapping关系

3. 模拟创建require方法， 初次执行查找main函数， 并通过mapping关系加载其他依赖


## loader
1. 在createAssets时，针对非js文件做一定的修改，使其变成 js文件

## plugin
1. 在mini-webpack 执行过程中，在各个生命周期使用tapable 触发事件，  pluginInit 初始化plugin，将事件和上下文传递给plugin, 使得插件能做到一些变更