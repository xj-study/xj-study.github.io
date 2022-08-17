// 1.全局变量 activeEffect
let activeEffect = null // 新增

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      // effect()
      // 4.当 activeEffect 存在时，便执行 activeEffect 方法
      if (activeEffect) activeEffect() // 新增
    },
  }
)

// 重构 3.执行 effect 方法，并将副作用函数 effectFn 作为参数传入
effect(function effectFn() {
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

// 重构 2.接收一个方法参数 fn ，执行时，将 fn 赋值给 activeEffect，并执行 fn 方法
function effect(fn) {
  activeEffect = fn
  fn()
}
