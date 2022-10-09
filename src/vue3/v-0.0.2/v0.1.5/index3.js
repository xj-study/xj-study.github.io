// 响应对象与用户副作用函数的映射关系容器
const container = new Map()

let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    get(target, propKey) {
      // 映射关系注册
      if (activeEffect) {
        container.set(target, activeEffect)
      }
      return target[propKey]
    },
    set(target, propKey, value) {
      target[propKey] = value
      // 响应执行用户副作用函数
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
  console.log('测试多次执行 effect 函数！', obj)
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
}
