/**
 * 接下来讨论 effect 函数嵌套调用问题。
 * 
 * effect 嵌套调用之后，外层的副作用函数无法准确注册，说明目前 activeEffect 的设计存在问题，
 * 运行之后就能发现，
 * `
 * effect fn run
 * effect fn hello inner
 * set to hello vue3
 * set to hello vue3 inner
 * effect fn hello vue3 inner
 * `
 * 通过第三行打印可以知道，代理对象 obj 的属性 text 没有关联的副作用函数！
 * 
 * 那是由于内部的 effect 执行后，activeEffect 被置为 null，这时外层副作用函数访问代理对象的
 * text 属性，进而触发了setter拦截器，不过由于此时的 activeEffect 为 null，副作用函数的注册
 * 逻辑就不会执行了，因此副作用函数无法顺利注册。
 * 
 * 那该如何处理，当内嵌 effect 执行完毕之后，正确的将 activeEffect 指向当前的副作用函数呢？
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
let activeEffect = null

const obj = reactive({ text: 'hello world!' })
const objInner = reactive({ obj, text: 'hello inner' })

effect(function effectFn() {
  console.log('effect fn run')
  effect(function effectFnInner() {
    console.log('effect fn', objInner.text)
  })
  document.body.innerText = obj.text
})

setTimeout(() => {
  console.log('set to hello vue3')
  obj.text = 'hello vue3'
}, 1000)

setTimeout(() => {
  console.log('set to hello vue3 inner')
  objInner.text = 'hello vue3 inner'
}, 1500)

function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
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
