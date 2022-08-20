// 1.增加一个全局的副作用函数容器，注释掉与 activeEffect 相关的代码
const store = new Set() // 新增

// let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      // if (activeEffect) activeEffect()
      // 3.遍历 store ，执行容器中的副作用函数
      store.forEach((fn) => fn()) // 新增
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
  // 2.将 fn 保存起来
  store.add(fn) // 新增
  fn()
}
