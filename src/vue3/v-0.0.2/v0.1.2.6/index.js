const obj = { text: 'hello world!' }
// 新增
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
  proxy.text = 'hello vue3' // 修改
}, 1000)

function effect() {
  document.body.innerText = proxy.text // 修改
}
