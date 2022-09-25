const obj = { text: 'hello world!' }

const proxy = new Proxy(obj, {
  get(target, propKey) {
    return target[propKey]
  },
  set(target, propKey, value) {
    target[propKey] = value
    effect()
  },
})

effect()
setTimeout(() => {
  proxy.desc = ' 你好吗？' // 修改
}, 1000)

function effect() {
  document.body.innerText = proxy.text + proxy.desc // 修改
}
