let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      if (activeEffect) activeEffect()
    },
  }
)

effect(function effectFn() {
  document.body.innerText = obj.text
})

// 新增，再次执行 effect 方法
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
