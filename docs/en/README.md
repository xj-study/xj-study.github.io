# Study Notes

![banner](./banner.png)
[[toc]]

## Markdown

### Getting started

If you not familar with Markdown, you can learn first [MarkDown Course](https://commonmark.org/help)。

### Markdown extendsion

vuepress 关于 Markdown 扩展的[详细文档](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E8%AF%AD%E6%B3%95%E6%89%A9%E5%B1%95)。

#### Code block

vuepress/config.js 配置

```js{1,9-11}:no-line-numbers
module.exports = {
  // site config
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

#### Import code file

vuepress/config.js 配置指定行数
@[code{3-5}](../.vuepress/config.js)

### use vue <Badge type="tip" text="v2" vertical="top" />

详细文档可参考[Vuepress 文档](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E5%9C%A8-markdown-%E4%B8%AD%E4%BD%BF%E7%94%A8-vue)。

```md
简单计算一下 1 + 2 = {{ 1 + 2}}
<span v-for="i in 3">span: {{ i }}</span>
```

简单计算一下 1 + 2 = {{ 1 + 2}}

<span v-for="i in 3">span: {{ i }}</span>
