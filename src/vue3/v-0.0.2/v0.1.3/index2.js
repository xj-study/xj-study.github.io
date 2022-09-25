const obj = new Proxy(
  { text: 'hello world!' },
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

effect(foo) // 修改
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

// 修改
function effect(fn) {
  fn()
}

function foo() {
  document.body.innerText = obj.text
}
