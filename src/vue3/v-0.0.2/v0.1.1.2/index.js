// const obj = { text: 'hello world!' }
const wrapperObj = wrapper({ text: 'hello world！' }) // 新增
effect()
setTimeout(() => {
  // obj.text = 'hello vue3'
  // 调用 setText 方法
  wrapperObj.setText('hello vue3') // 新增
}, 1000)

function effect() {
  // document.body.innerText = obj.text
  document.body.innerText = wrapperObj.getText() // 新增
}

// 新增
function wrapper(obj) {
  let newObj = {}
  newObj.setText = function (newVal) {
    obj.text = newVal
    effect()
  }
  newObj.getText = function () {
    return obj.text
  }
  return newObj
}
