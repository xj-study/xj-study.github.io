/**
 * 基于上个版本，我们新增一小段代码，用于测试多次执行 effect 函数会发生什么。
 * 
 * 执行之后，我们发现，视图没有更新为 hello vue3！
 * 而是再次打印 ”测试多次执行 effect 函数！“
 * 说明当 obj.text 修改时， 再次执行了 consoleFn 方法。
 * 
 * 原因可以很容易分析出来，那是由于第二次执行 effect 函数时，activeEffect被赋值为 consoleFn 了。
 * 怎么解决这个问题呢？
 */

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

// new
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