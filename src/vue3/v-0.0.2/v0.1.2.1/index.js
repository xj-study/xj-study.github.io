const obj = { text: 'hello world!' }

// 新增
let value = obj.text
Object.defineProperty(obj, 'text', {
  get() {
    return value
  },
  set(val) {
    value = val
    effect()
  },
})

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
