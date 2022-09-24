const obj = { text: 'hello world!' }

// 遍历对象 obj 的所有属性，并对其做响应式处理
const keys = Object.keys(obj)
keys.forEach((prop) => {
  defineReactive(obj, prop)
})

effect()
setTimeout(() => {
  // obj.desc = '你好吗？'
  $set(obj, 'desc', '你好吗？') // 修改
}, 1000)

function effect() {
  document.body.innerText = obj.text + obj.desc
}

// 新增
function $set(obj, prop, value) {
  defineReactive(obj, prop)
  obj[prop] = value
}

// 对指定对象 obj 的属性 prop 做响应处理
function defineReactive(obj, prop) {
  let value = obj[prop]
  Object.defineProperty(obj, prop, {
    get() {
      return value
    },
    set(val) {
      value = val
      effect()
    },
  })
}
