const obj = { text: 'hello world!' }
// 新增 setText 方法
obj.setText = function (newVal) {
  this.text = newVal
  effect()
}
effect()
setTimeout(() => {
  // obj.text = 'hello vue3'
  // 调用 setText 方法
  obj.setText('hello vue3')
}, 1000)

function effect() {
  document.body.innerText = obj.text // 新增
}
