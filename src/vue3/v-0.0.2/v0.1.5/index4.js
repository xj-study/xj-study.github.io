// 响应对象与用户副作用函数的映射关系容器
const container = new Map()

let activeEffect = null
const obj = new Proxy(
  { text: 'hello world!', name: '谢军' }, // 修改
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
// 测试 effect 使用同一个响应对象的不同属性
effect(function consoleFn() {
  console.log('测试 effect 使用同一个响应对象的不同属性')
  document.body.innerText = '姓名：' + obj.name // 新增
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)
function effect(fn) {
  activeEffect = fn
  fn()
}
