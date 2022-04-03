# 学习笔记

![banner](./banner.jpg)
[[toc]]

## Markdown

### 入门文档

若对 Markdown 不太了解，可以先学习 [MarkDwon 教程](https://commonmark.org/help)。

### Markdown 扩展

vuepress 关于 Markdown 扩展的[详细文档](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E8%AF%AD%E6%B3%95%E6%89%A9%E5%B1%95)。

#### 代码块

vuepress/config.js 配置

```js{1,9-11}:no-line-numbers
module.exports = {
  // 站点配置
  lang: "zh-CN",
  title: "学习笔记",
  description: "这是我的第一个 VuePress 站点",

  // 主题和它的配置
  theme: "@vuepress/theme-default",
  themeConfig: {
    logo: "https://vuejs.org/images/logo.png",
  },
};
```

#### 导入代码块

vuepress/config.js 配置指定行数
@[code{3-5}](./.vuepress/config.js)

### 使用 vue <Badge type="tip" text="v2" vertical="top" />

详细文档可参考[Vuepress 文档](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E5%9C%A8-markdown-%E4%B8%AD%E4%BD%BF%E7%94%A8-vue)。

```md
简单计算一下 1 + 2 = {{ 1 + 2}}
<span v-for="i in 3">span: {{ i }}</span>
```

简单计算一下 1 + 2 = {{ 1 + 2}}

<span v-for="i in 3">span: {{ i }}</span>
