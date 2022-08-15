const obj = { text: 'hello world!' }

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
  // 直接调用 effect 方法
  effect() // 新增
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
