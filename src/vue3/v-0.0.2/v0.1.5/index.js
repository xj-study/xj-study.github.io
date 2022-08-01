/**
 * 解决方案：
 * 首先，注释掉与activeEffect相关的代码，引入一个全局变量，作为副作用函数的容器，
 * 当effect执行时，将传入的fn保存在容器里，当有触发setter拦截器时，
 * 就遍历执行容器中所有的副作用函数。
 *
 * 这个方案完美了吗？
 */

// new  1.增加一个全局的副作用函数容器，注释掉与activeEffect相关的代码
const store = new Set()

// let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      // if (activeEffect) activeEffect()
      // new 3.遍历store，执行容器中的副作用函数
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
 * 我只想修改text时，执行与text有关的副作用函数，如effectFn。
 * 现在一旦触发拦截器setter，就会执行容器里所有的副作用函数。
 *
 * 相信vue3肯定也不是这么干的，不然我们项目肯定跑不起来。那该怎么办呢？
 */
