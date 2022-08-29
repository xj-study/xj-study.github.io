const store = new Map()
console.log('store', store)

const effectStack = []
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
    // 清理子副作用函数
    cleanupSubEffects(effectFn) // new

    if (activeEffect) {
      // 收集子副作用函数
      activeEffect.subEffectFns.push(effectFn) // new
    }

    effectStack.push(activeEffect)
    activeEffect = effectFn
    fn()
    activeEffect = effectStack.pop()
  }
  // 收集 副作用函数的容器对象
  effectFn.deps = [] // new
  // 收集 子副作用函数
  effectFn.subEffectFns = [] // new
  effectFn()
}

// 清理副作用函数相关的关联 new
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// 清理嵌套子副作用函数 new
function cleanupSubEffects(effectFn) {
  for (let i = 0; i < effectFn.subEffectFns.length; i++) {
    const tempEffectFn = effectFn.subEffectFns[i]
    cleanup(tempEffectFn)
  }
  effectFn.subEffectFns.length = 0
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
