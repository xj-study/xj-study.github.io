/**
 * 处理 click 操作
 * @param {Nodes, Node, String} selectorOrElement
 * @param {Object} handler
 * @returns
 */
function clickHandleByName(selectorOrElement, handler) {
  let btnlist = getFirstElement(selectorOrElement)
  if (!btnlist) {
    console.log(`通过${selectorOrElement}无法查询到元素`)
    return
  }

  btnlist.onclick = function (evt) {
    let name = evt.target.getAttribute('name')
    handler[name] && handler[name]()
  }
}

/**
 *  通过选择器或元素及元素列表取得第一个元素
 * @param {Nodes, Node, String} selectorOrElement
 * @returns
 */
function getFirstElement(selectorOrElement) {
  if (typeof selectorOrElement == 'string') {
    selectorOrElement = document.querySelector(selectorOrElement)
  }
  if (selectorOrElement && selectorOrElement.length) selectorOrElement = selectorOrElement[0]
  return selectorOrElement
}

function createNode(content, tag = 'span', className = '') {
  const node = document.createElement(tag)
  className && (node.className = className)
  node.innerHTML = content
  return node
}

function getRandom(max) {
  return Math.ceil(Math.random() * max) % max
}
