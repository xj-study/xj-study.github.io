/**
 * 解决方案：
 * 首先，注释掉与 activeEffect 相关的代码，引入一个全局容器，
 * 当 effect 执行时，将传入的 fn 保存在容器里，当有触发 setter 拦截器时，
 * 就遍历执行容器中所有的函数。
 *
 * 这个方案完美了吗？
 */

// new  1.增加一个全局的容器，注释掉与 activeEffect 相关的代码
const store = new Set()

// let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      // if (activeEffect) activeEffect()
      // new 3.遍历 store，执行容器中的方法
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
  // new 2.将fn 保存起来
  store.add(fn)
  fn()
}

/**
 * 这个方案过于粗暴！
 * 我只想 obj.text 修改时，执行与 obj.text 有关联的函数，如 effectFn。
 * 现在一旦触发拦截器 setter，就会执行所有保存在 store 里的函数。
 *
 * 相信 vue3肯定也不是这么干的，不然我们项目肯定跑不起来。那该怎么办呢？
 *
 */
