# 开始

从零开始一步一步记录

## 创建项目 sd

创建项目 sd，通过`pnpm init` 快速创建 package.json 文件

## esbuild-v0.1 项目

### 初始化

1. 在项目 sd 中新建 packages 文件夹，并在 packages 文件夹里创建 esbuild-v0.1 项目，同样使用`pnpm init`创建模块描述文件 package.json
2. 创建 index.js 及 index.html 文件

index.js 文件

```js
console.log('esbuilds v0.1')
```

index.html 文件

```html
<script src="./index.js"></script>

<h1>esbuild v0.1</h1>
```

3. 浏览打开 index.html 文件，console 里正常打印 `esbuilds v0.1`，页面也正常显示标题 `esbuilds v0.1`

### 引入 ts

创建一个新文件 hello.ts

```ts
console.log('hello ts')
let list: number[] = [1, 2, 3, 9]
for (let i = 0; i < list.length; i++) {
  console.log('list show ', list[i])
}
```

然后修改 index.html 文件

```html
<script src="./index.js"></script>
<script src="./hello.ts"></script>

<h1>esbuild v0.1</h1>
```

运行时，发现报错了，`Uncaught SyntaxError: Unexpected token ':' (at hello.ts:2:9)`

说明需要将 ts 编译为浏览器可以认识的 js 代码。

### 引入 esbuild

这时，引入 esbuild，先安装好对应的包，然后在 package.json 里配置一条脚本

```sheet
"dev":"esbuild hello.ts --bundle --outfile=index-browser.js"
```

再修改一下项目 sd 的 package.json 文件，增加一条指令

```
"dev": "pnpm --filter=\"./packages/**\" --parallel dev"
```

修改一下 index.html 文件，引入 index-browser.js 文件

```html
<script src="./index.js"></script>
<script src="./index-browser.js"></script>

<h1>esbuild v0.1</h1>
```

运行正常。
