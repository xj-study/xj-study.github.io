/**
 * 当同步多次修改响应对象的同一个属性值时，我们发现对应的副作用函数执行了多次
 * 作为一个框架，我们需要追求性能的极致，这种多次执行是完全没有必要的。
 * 那改如何解决呢？
 */

const store = new Map()
console.log('store', store)

const effectStack = []
let activeEffect = null

const obj = reactive({ text: 'hello world!' })

effect(function effectFn() {
  console.log('effect fn run')
  document.body.innerText = obj.text
})

setTimeout(function t1() {
  console.log('set text to hello vue3')
  obj.text = 'hello vue3' // new
  console.log('set text to hello self')
  obj.text = 'hello self' // new
}, 1000)

function effect(fn) {
  const effectFn = () => {
    // 清理关联
    cleanup(effectFn)
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

// 清理副作用函数相关的关联
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// 清理嵌套子副作用函数
function cleanupSubEffects(effectFn) {
  for (let i = 0; i < effectFn.subEffectFns.length; i++) {
    const tempEffectFn = effectFn.subEffectFns[i]
    cleanup(tempEffectFn)
  }
  effectFn.subEffectFns.length = 0
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

        // 收集当前副作用函数关联的 effects 容器
        activeEffect.deps.push(effects)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const deps = store.get(target)
      if (!deps) return

      const effects = deps.get(key)
      if (!effects) return

      const toRunEffects = new Set()
      effects.forEach((fn) => {
        if (fn != activeEffect) toRunEffects.add(fn)
      })
      toRunEffects.forEach((fn) => fn())
    },
  })
}
