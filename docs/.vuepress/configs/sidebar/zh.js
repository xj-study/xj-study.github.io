let effects = require('./effects.js')

module.exports = {
  '/guide/': [
    {
      text: '简单回顾',
      children: ['/guide/README.md', '/guide/commonjs.md', '/guide/vuepress.md', '/guide/mescroll/README.md'],
    },
    {
      text: 'vue3学习',
      link: '/vue3/README.md',
    },
    // {
    //   text: '运维笔记',
    //   link: '/operations/README.md',
    // },
  ],
  '/vue3/effect/': [
    {
      text: '响应系统',
      link: '/vue3/effect/README.md',
      children: effects,
    },
  ],
  // '/operations/': [
  //   {
  //     text: '运维笔记',
  //     children: ['/operations/README.md'],
  //   },
  // ],
  // '/tlower/': [
  //   {
  //     text: '如何使用',
  //     children: ['/tlower/README.md'],
  //   },
  // ],
}
