// 映射关系容器
const container = new Map() // 新增

let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    get(target, propKey) {
      // 新增
      if (activeEffect) {
        container.set(target, activeEffect)
      }
      return target[propKey]
    },
    set(target, propKey, value) {
      target[propKey] = value
      // effect()
      // if (activeEffect) activeEffect()
      // 新增
      let runEffect = container.get(target)
      if (runEffect) runEffect()
    },
  }
)

effect(function foo() {
  document.body.innerText = obj.text
})

// 再次执行 effect 方法
effect(function consoleFn() {
  console.log('测试多次执行 effect 函数！')
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
}
