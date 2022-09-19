// const obj = { text: 'hello world!' }
const wrapperObj = wrapper({ text: 'hello world！', name: 'Name ' }) // 修改
effect()
setTimeout(() => {
  // obj.text = 'hello vue3'
  // 调用 setText 方法
  wrapperObj.setText('hello vue3')
}, 1000)

function effect() {
  // document.body.innerText = obj.text
  document.body.innerText = wrapperObj.getName() + wrapperObj.getText() // 修改
}
// ... 省略其它代码
// 新增
function wrapper(obj) {
  let newObj = {}
  // 修改
  // newObj.setText = function (newVal) {
  //   obj.text = newVal
  //   effect()
  // }
  // newObj.getText = function () {
  //   return obj.text
  // }

  // 新增
  addApi()
  function addApi() {
    const keys = Object.keys(obj)
    keys.forEach((key) => {
      // getter/setter 方法名按小驼峰规则，将 key 的首字母大写处理
      const tmp = key.charAt(0).toUpperCase() + key.substr(1)
      newObj[`get${tmp}`] = () => obj[key]
      newObj[`set${tmp}`] = (val) => {
        obj[key] = val
        effect()
      }
    })
  }

  return newObj
}
