# CommonJs 规范

CommonJs 是一个模块化规范，主要了解 `module`, `exports`, `require` 几个要点就可以了

### exports

规范规定，一个文件就是一个模块，每个模块内部都有 `require`，`module` 变量可用。为了方便，Node 在实现规范时，为每个模块内部都提供了一个 `exports` 私有变量，指向 `module.exports`。

@[code{1-10} {1}](../.vuepress/configs/navbar/zh.js)
@[code {1}](../.vuepress/configs/navbar/index.js)

### require

`require` 的基本功能就是读入并执行一个 js 文件，并返回该模块的 `exports` 对象
@[code{1-10} {1,2}](../.vuepress/config.js)
