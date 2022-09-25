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

// 修改
effect(function foo() {
  document.body.innerText = obj.text
})
setTimeout(() => {
  obj.text = 'hello vue3' 
}, 1000)

function effect(fn) {
  fn()
}

// 注释掉
// function foo() {
//   document.body.innerText = obj.text
// }
