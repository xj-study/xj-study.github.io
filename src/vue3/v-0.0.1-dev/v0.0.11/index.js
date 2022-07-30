console.log('vue3 learn start v0.0.11')
/**
 * 
 */

// 修改一个合适的名字
// 收集所有有 effect
const store = new WeakMap()
// 当前副作用函数
let activeEffect = null

const obj = reactive({ count: 0 })

effect(function () {
  console.log('effect 1', obj.count)
  document.body.innerText = '计数：' + obj.count++
})

setTimeout(() => {
  obj.count = 1
}, 1000)


function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
  }
  effectFn()
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      // 抽离 track 追踪函数
      track(target, key)

      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal

      // 抽离 trigger 触发函数
      trigger(target, key)
    },
  })
}

function track(target, key) {
  if (!activeEffect) return

  let depsMap = store.get(target)
  if (!depsMap) {
    store.set(target, (depsMap = new Map()))
  }

  let deps = depsMap[key]
  if (!deps) {
    depsMap.set(key, (deps = new Set()))
  }

  deps.add(activeEffect)
}

function trigger(target, key) {
  const depsMap = effectMap.get(target)
  if (!depsMap) return

  const deps = depsMap[key]
  if (deps) {
    const newDeps = new Set(deps)
    newDeps.forEach((fn) => fn())
  }
}
