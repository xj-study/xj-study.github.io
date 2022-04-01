module.exports = {
  // 站点配置
  lang: "zh-CN",
  title: "学习笔记",
  description: "这是我的第一个 VuePress 站点",

  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    "/en/": {
      lang: "en-US",
      title: "Study Notes",
      description: "a note about learning process",
    },
    "/": {
      lang: "zh-CN",
      title: "学习笔记",
      description: "记录学习过程的笔记",
    },
  },

  // 主题和它的配置
  theme: "@vuepress/theme-default",
  themeConfig: {
    logo: "/images/logo.png",
    locales: {
      "/": {
        selectLanguageName: "中文",
        selectLanguageText: "语言",
      },
      "/en/": {
        selectLanguageName: "english",
        selectLanguageText: "language",
      },
    },
  },
};
