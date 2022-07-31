/**
 * 解决方案：
 *
 * 要如何处理才能实现对应属性值变化之后，执行对应的副作用函数呢？
 *
 * 我们可以让属性的key与副作用函数关联起来。
 * 通过将store修改为Map类型，其数据项为 key -> fn 键值对。
 * 其中键值key为对象的属性值，值fn为副作用函数。
 * 再增加getter拦截器，当effect函数执行并访问对象的属性时，
 * 趁机将副作用函数通过key->activeEffect键值对保存在副作用函数容器store里，
 * 然后在setter拦截器里，取得store容器里键值为key对应的值，若值存在，就执行。
 *
 */

// 全局的容器，用于存储用户的操作函数
// new 1.将Set修改为Map，并将activeEffect声明去掉注释
const store = new Map()

let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    // new 2.增加 getter 拦截
    get(target, key) {
      if (activeEffect) {
        store.set(key, activeEffect)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      // 遍历store，执行容器中的方法
      // store.forEach((fn) => fn())
      // new 3.根据key取得对应的函数，并执行
      const fn = store.get(key)
      fn && fn()
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
  // new 4.注释store.add(fn)，并将activeEffect注释去掉
  activeEffect = fn
  // store.add(fn)
  fn()
}
