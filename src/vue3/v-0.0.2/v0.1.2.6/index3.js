const obj = new Proxy(
  { text: 'hello world!' }, // 修改
  {
    get(target, propKey) {
      return target[propKey]
    },
    set(target, propKey, value) {
      target[propKey] = value
      effect()
    },
  }
)

effect()
setTimeout(() => {
  obj.text = 'hello vue3' // 修改
}, 1000)

function effect() {
  document.body.innerText = obj.text // 修改
}
