/**
 * 
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!' })
const obj2 = reactive({ text: 'hello world 2!' })

effect(function effectFn() {
  document.body.innerText = obj.text
})

effect(function effectFn2() {
  document.body.innerText = obj2.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      if (activeEffect) {
        store.set(key, activeEffect)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const fn = store.get(key)
      fn && fn()
    },
  })
}
