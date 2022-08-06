/**
 * 经过分析之后发现，
 * 当代理对象的 text 属性修改触发副作用函数执行时，由于 activeEffect 指向就是当前副作用函数
 * 所以不会继续执行，之后无论怎么修改都无法触发副作用函数的执行。
 * 源头在 activeEffect 指向问题，那我们可以当 fn 执行完后，将 activeEffect 设置为 null，
 * 这样不影响副作用函数的注册，也能解决无法触发的问题。
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!', count: 1 })

effect(function effectFn() {
  console.log('effect fn run')
  document.body.innerText = obj.text + ' ' + obj.count++
})

setTimeout(() => {
  console.log('set to hello vue3')
  obj.text = 'hello vue3'
}, 1000)

setTimeout(() => {
  console.log('set to hello self')
  obj.text = 'hello self'
}, 2000)

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
    // new
    activeEffect = null
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

      effects.forEach((fn) => {
        if (fn != activeEffect) fn()
      })
    },
  })
}
