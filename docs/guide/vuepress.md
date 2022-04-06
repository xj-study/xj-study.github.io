---
title: vuepress学习记录
description: 学习vuepress
---

# Vuepress

## Markdown 入门文档

若对 Markdown 不太了解，可以先学习 [MarkDwon 教程](https://commonmark.org/help)。

## Markdown 扩展

vuepress 关于 Markdown 扩展的[详细文档](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E8%AF%AD%E6%B3%95%E6%89%A9%E5%B1%95)。

### 代码块

#### 指定高亮行数

显示 vuepress/config.js 配置代码指定行高度

```js{1,9-11}:no-line-numbers
module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: '学习笔记',
  // 主题和它的配置
  theme: '@vuepress/theme-default',
  themeConfig: {
    logo: '/images/logo.jpg',
    locales: {
      '/': {
        selectLanguageName: '中文',
        selectLanguageText: '语言',
      },
      '/en/': {
        selectLanguageName: 'english',
        selectLanguageText: 'language',
      },
    },
  },
}

```

#### 导入代码

vuepress/config.js 文件指定行数
@[code{3-5}](../.vuepress/config.js)

### 使用 vue 组件

详细文档可参考[Vuepress 文档](https://v2.vuepress.vuejs.org/zh/guide/markdown.html#%E5%9C%A8-markdown-%E4%B8%AD%E4%BD%BF%E7%94%A8-vue)。

#### 模板语法

```md
简单计算一下 1 + 2 = {{ 1 + 2}}
<span v-for="i in 3">span: {{ i }}</span>
```

简单计算一下 1 + 2 = {{ 1 + 2}}

<span v-for="i in 3">span: {{ i }}</span>

## Github Pages 部署

相关文档可参考[Vuepress 部署](https://v2.vuepress.vuejs.org/zh/guide/deployment.html#github-pages)。

### 注意事项

1. 先配置好 github workflows，重点查看高亮行代码
@[code{47-55} {6}](../../.github/workflows/docs.yml) 
2. 按照下图步骤配置好就可以了
![Image](/images/vuepress-githubpages.jpg)
