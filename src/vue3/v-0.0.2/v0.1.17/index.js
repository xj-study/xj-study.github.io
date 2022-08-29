const store = new Map()
console.log('store', store)

const effectStack = []
let activeEffect = null

const obj = reactive({ text: 'hello world!', text2: 'hello world 2!', isUseText: true })

effect(function effectFn() {
  console.log('effect fn run')
  document.body.innerText = obj.isUseText ? obj.text : obj.text2 // new
})

setTimeout(function t1() {
  console.log('set to use text')
  obj.isUseText = false
}, 1000)

setTimeout(function t2() {
  console.log('set to text value vue3')
  obj.text = 'hello vue3!'
}, 1500)

function effect(fn) {
  const effectFn = () => {
    // 清理关联
    cleanup(effectFn) // new
    // 清理子副作用函数
    cleanupSubEffects(effectFn)

    if (activeEffect) {
      // 收集子副作用函数
      activeEffect.subEffectFns.push(effectFn)
    }

    effectStack.push(activeEffect)
    activeEffect = effectFn
    fn()
    activeEffect = effectStack.pop()
  }
  // 收集 副作用函数的容器对象
  effectFn.deps = []
  // 收集 子副作用函数
  effectFn.subEffectFns = []
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

    // 收集当前副作用函数关联的 effects 容器
    activeEffect.deps.push(effects)
  }
}
function trigger(target, key, val) {
  const deps = store.get(target)
  if (!deps) return

  const effects = deps.get(key)
  if (!effects) return

  // new
  const toRunEffects = new Set()
  effects.forEach((fn) => {
    if (fn != activeEffect) toRunEffects.add(fn)
  })
  toRunEffects.forEach((fn) => fn())

  // effects.forEach((fn) => {
  //   if (fn != activeEffect) fn()
  // })
}
