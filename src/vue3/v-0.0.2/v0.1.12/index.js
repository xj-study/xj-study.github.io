/**
 * 栈溢出是由于当副作用函数执行时，会修改代理对象的属性从而再次执行当前副作用函数。
 *
 * 那我们是不是可以当副作用函数执行时，判断其是否与当前正在执行的副作用相同，若相同
 * 就不执行呢？
 * 如代码注释步骤1，执行之后发现确实没有栈溢出了。
 * 这时，我们增加定时器，1s 后，修改代理对象 obj 的属性 text，执行之后发现，副作用
 * 函数没有执行！
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

      effects.forEach((fn) => {
        // new 1.与当前激活副作用函数不一样时才执行
        if (fn != activeEffect) fn()
      })
    },
  })
}