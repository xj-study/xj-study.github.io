/**
 */

// 全局的容器，用于存储用户的操作函数
const store = new Set()

// let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      // if (activeEffect) activeEffect()
      // 遍历 store，执行容器中的方法
      store.forEach((fn) => fn())
    },
  }
)

effect(function effectFn() {
  document.body.innerText = obj.text
})

effect(function consoleFn() {
  console.log('测试多次执行 effect 函数！')
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect(fn) {
  // activeEffect = fn
  store.add(fn)
  fn()
}
