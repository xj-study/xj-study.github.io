let postion = ['beforebegin', 'afterbegin', 'beforeend', 'afterend']
let postag = ['div', 'span', 'span', 'div']
let posclassName = ['list', '', '', 'list']
let list = [
  {
    type: 'button',
    name: 'insert-before',
    content: '通过insertBefore',
    handle: function () {
      let node = getFirstElement('#c2-id')

      node.insertBefore(createNode('通过insertBefore'), node.firstChild)
    },
  },
  {
    type: 'button',
    name: 'insert-adjacent-element',
    content: '通过insertAdjacentElement',
    handle: function () {
      const node = getFirstElement('#c2-id')
      const ri = getRandom(postion.length)
      const pos = postion[ri]
      const tag = postag[ri]
      const className = posclassName[ri]
      node.insertAdjacentElement(pos, createNode(`通过insertAdjacentElement插入${pos}位置`, tag, className))
    },
  },
  {
    type: 'button',
    name: 'insert-adjacent-text',
    content: '通过insertAdjacentText',
    handle: function () {
      const node = getFirstElement('#c2-id')
      const ri = getRandom(postion.length)
      const pos = postion[ri]
      node.insertAdjacentText(pos, `通过insertAdjacentText插入${pos}位置`)
    },
  },
  {
    type: 'button',
    name: 'insert-adjacent-html',
    content: '通过insertAdjacentHTML',
    handle: function () {
      const node = getFirstElement('#c2-id')
      const ri = getRandom(postion.length)
      const pos = postion[ri]
      const tag = postag[ri]
      const className = posclassName[ri]
      let html = `<${tag} `
      if (className) html += `class="${className}">通过insertAdjacentHTML插入${pos}位置</${tag}>`
      node.insertAdjacentHTML(pos, html)
    },
  },
  {
    type: 'button',
    name: 'append',
    content: '通过append',
    handle: function () {
      const node = getFirstElement('#c2-id')
      node.append(createNode('通过insertBefore'))
    },
  },
  {
    type: 'button',
    name: 'reset',
    content: 'reset',
    handle: function () {
      const node = getFirstElement('#c2-id')
      node.innerHTML = '<span>id 元素</span>'
      node.parentElement.innerHTML = node.outerHTML
    },
  },
]
cms.use({ selector: '.btn-list-2', list })
