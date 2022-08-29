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

  effects.forEach((fn) => {
    // new 1.与当前激活副作用函数不一样时才执行
    if (fn != activeEffect) fn()
  })
}
