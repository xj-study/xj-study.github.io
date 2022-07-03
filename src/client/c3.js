;(function () {
  let list = [
    {
      type: 'button',
      name: 'inner-html',
      content: '通过innerHTML',
      handle: function () {
        let node = getFirstElement('#c2-id')

        node.innerHTML = '<span>通过innerHTML修改</span>'
      },
    },
    {
      type: 'button',
      name: 'outer-html',
      content: '通过outerHTML',
      handle: function () {
        const node = getFirstElement('#c2-id')
        node.outerHTML = '<div id="c2-id" class="list"><span>通过outerHTML修改</span></div>'
      },
    },
    {
      type: 'button',
      name: 'replaceChildren',
      content: '通过replaceChildren',
      handle: function () {
        const node = getFirstElement('#c2-id')
        node.replaceChildren(createNode('通过replaceChildren'))
      },
    },
  ]
  cms.use({ selector: '.btn-list-3', list })
})()
