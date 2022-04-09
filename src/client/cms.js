const cms = {}
;(function (cms) {
  cms.use = use
  const elementFactory = { button: createButton }

  function use(conf) {
    const container = getFirstElement(conf.selector)
    const frag = document.createDocumentFragment()
    const list = conf.list
    for (let i = 0; i < list.length; i++) {
      frag.appendChild(createElement(list[i]))
    }
    container.appendChild(frag)

    const handler = list.reduce(function (res, cur) {
      res[cur.name] = cur.handle
      return res
    }, {})
    clickHandleByName(container, handler)
  }

  function createElement(data) {
    let type = data.type
    let fac = elementFactory[type]
    if (fac) return fac(data)
    return createComment(data)
  }

  function createButton(data) {
    const node = document.createElement('div')
    node.className = 'btn'
    node.setAttribute('name', data.name)
    node.textContent = data.content
    return node
  }

  function createComment(data) {
    let comment = `${data.type} 类型组件不存在`
    return document.createComment(comment)
  }
})(cms)
