/**
 * 实现新旧值
 */
const store = new Map()
console.log('store', store)

const effectStack = []
let activeEffect = null

const obj = reactive({ text: 'hello world!' })

watch(
  () => obj.text,
  (val, oldVal) => {
    console.log('test watch', val, oldVal)
  },
  { immediate: true }
)

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

const flush = new Set()
let isFlush = false
/**
 *
 * @param {*} source 响应
 * @param {*} cb 回调函数
 * immediate: 是否立即执行
 */
function watch(source, cb, options) {
  let getter = null
  if (typeof source === 'function') {
    getter = source
  } else {
    getter = () => traverse(source)
  }

  let oldValue, newValue

  const job = () => {
    newValue = effectFn()
    cb(newValue, oldValue)
    oldValue = newValue
  }

  const effectFn = effect(() => getter(), {
    isLazy: true,
    schedule: () => {
      job()
    },
  })

  if (options.immediate) {
    job()
  } else {
    oldValue = effectFn()
  }
}

/**
 * 遍历对象
 * @param {*} value
 * @returns
 */
function traverse(value) {
  if (typeof value != 'object' || value === null) return
  for (k in value) {
    traverse(value[k])
  }
}

function computed(fn) {
  let value = null
  let dirty = true
  const effectFn = effect(fn, {
    isLazy: true,
    schedule() {
      dirty = true
    },
  })

  const obj = {
    get value() {
      if (dirty) {
        value = effectFn()
        dirty = false
      }
      return value
    },
  }
  return obj
}

/**
 *
 * @param {*} fn 副作用函数
 * @param {*} options 参数
 * { schedule, isLazy }
 * schedule: 调度函数
 * isLazy: 是否懒执行
 */
function effect(fn, options = {}) {
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
    const res = fn()
    activeEffect = effectStack.pop()
    return res
  }
  // 收集 副作用函数的容器对象
  effectFn.deps = []
  // 收集 子副作用函数
  effectFn.subEffectFns = []
  effectFn.options = options || {}

  if (!options.isLazy) {
    effectFn()
  }
  return effectFn
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
  return target[key]
}
function trigger(target, key, val) {
  target[key] = val

  const deps = store.get(target)
  if (!deps) return

  const effects = deps.get(key)
  if (!effects) return

  const toRunEffects = new Set()
  effects.forEach((fn) => {
    if (fn != activeEffect) toRunEffects.add(fn)
  })
  toRunEffects.forEach((fn) => {
    if (fn.options.schedule) {
      fn.options.schedule(fn)
    } else {
      fn()
    }
  })
}
