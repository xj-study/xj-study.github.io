console.log('vue3 learn start v0.0.5')

// 收集所有有 effect
const effectMap = {}
// 当前副作用函数
let activeEffect = null

const obj = reactive({ text: 'hello world' })
const otherObj = reactive({ text: 'hello world again' })

effect(function () {
  document.body.innerText = obj.text
})

effect(function () {
  document.body.innerText = otherObj.text
})


console.log('effectMap', effectMap)

setTimeout(() => {
  otherObj.text = 'hello vue 3'
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
}

function reactive(obj) {
  return new Proxy(obj, {
    // 新增修改代码
    get(target, key) {
      effectMap[key] = activeEffect
      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal
      // 新增修改代码
      const eft = effectMap[key]
      eft && eft()
    },
  })
}
