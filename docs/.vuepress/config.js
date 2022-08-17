const { registerComponentsPlugin } = require('@vuepress/plugin-register-components')

const { defaultTheme } = require('vuepress')

const path = require('path')
const navbar = require('./configs/navbar')
const sidebar = require('./configs/sidebar')

let srcPath = path.resolve(__dirname, '../../src')
console.log('src path', srcPath)

module.exports = {
  // 站点配置
  lang: 'zh-CN',
  title: '学习笔记',
  description: '这是我的第一个 VuePress 站点',

  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/en/': {
      lang: 'en-US',
      title: 'Study Notes',
      description: 'a note about learning process',
    },
    '/': {
      lang: 'zh-CN',
      title: '学习笔记',
      description: '记录学习过程的笔记',
    },
  },

  // 主题和它的配置
  theme: defaultTheme({
    locales: {
      logo: '/images/logo.jpg',
      '/': {
        selectLanguageName: '中文',
        selectLanguageText: '语言',
        navbar: navbar.zh,
        sidebar: sidebar.zh,
      },
      '/en/': {
        selectLanguageName: 'english',
        selectLanguageText: 'language',
      },
    },
  }),

  markdown: {
    importCode: {
      handleImportPath: (str) => str.replace(/^@src/, srcPath),
    },
  },

  plugins: [
    registerComponentsPlugin({
      // 配置项
      componentsDir: path.resolve(__dirname, './components'),
    }),
  ],
}
