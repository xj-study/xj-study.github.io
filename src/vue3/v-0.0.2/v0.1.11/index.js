/**
 * 通过增加一个 count 字段，并在副作用函数里执行 count++。
 * 执行一下代码之后，发现报栈溢出错误。
 * 
 * 那是因为当执行 effect 注册副作用函数时，`obj.count++` 相当于 `obj.count = obj.count + 1`
 * 这样不仅去获取了 count 值，还修改了 count 的值，导致程序进入了死循环，从而栈溢出。
 * 
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

// new 1.新增一个 count 属性
const obj = reactive({ text: 'hello world!', count: 1 })

// 注释掉无关代码
// const obj2 = reactive({ text: 'hello world 2!' })

effect(function effectFn() {
  console.log('effect fn run')
  // new 2.新增 count++
  document.body.innerText = obj.text + obj.count++
})

// 注释掉无关代码
// effect(function effectFn2() {
//   console.log('effect fn2 run')
//   document.body.innerText = obj2.text
// })

// 注释掉无关代码
// setTimeout(() => {
//   console.log('set to hello vue3')
//   obj.text = 'hello vue3'
// }, 1000)

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
  }
  effectFn()
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      if (activeEffect) {
        let deps = store.get(target)
        if (!deps) {
          store.set(target, (deps = new Map()))
        }

        let effects = deps.get(key)
        if (!effects) {
          deps.set(key, (effects = new Set()))
        }

        effects.add(activeEffect)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const deps = store.get(target)
      if (!deps) return

      const effects = deps.get(key)
      if (!effects) return

      effects.forEach((fn) => fn())
    },
  })
}
