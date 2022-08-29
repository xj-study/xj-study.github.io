// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!' })
const obj2 = reactive({ text: 'hello world 2!' })

effect(function effectFn() {
  console.log('effect fn run')
  document.body.innerText = obj.text
})

effect(function effectFn2() {
  console.log('effect fn2 run')
  document.body.innerText = obj2.text
})

setTimeout(() => {
  console.log('set to hello vue3')
  obj.text = 'hello vue3'
}, 1000)

// new 重构 effect 副作用注册函数。
// 通过将 fn 的执行封装在另外一个函数里，然后 activeFn 指向这个函数，
// 这时 store 里保存的就是这个封装函数 effectFn。
// 当代理对象的属性值修改时，将会触发 effectFn 的执行，而 activeEffect
// 顺利的指向 effectFn，然后 fn 执行时，收集的也是这个函数，完美！
function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
  }
  effectFn()
}

function reactive(data) {
  return new Proxy(data, {
    get(target, key) {
      track(target, key)
      return target[key]
    },
    set(target, key, val) {
      target[key] = val
      trigger(target, key, val)
    },
  })
}

function track(target, key) {
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
}

function trigger(target, key, val) {
  const deps = store.get(target)
  if (!deps) return

  const effects = deps.get(key)
  if (!effects) return

  effects.forEach((fn) => fn())
}
