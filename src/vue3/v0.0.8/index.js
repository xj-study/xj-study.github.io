console.log('vue3 learn start v0.0.8')

// 收集所有有 effect
const effectMap = new Map()
// 当前副作用函数
let activeEffect = null

const obj = reactive({ count: 0 })

effect(function () {
  console.log('effect 1')
  document.body.innerText = '计数：' + obj.count++
})

setTimeout(() => {
  obj.count = 1
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
  // 解决二次执行重新保存依赖时，activeEffect 不对的问题
  activeEffect = null
}

function reactive(obj) {
  return new Proxy(obj, {
    get(target, key) {
      // new
      if (!activeEffect) return target[key]

      // effectMap[key] = activeEffect
      let depsMap = effectMap.get(target)
      if (!depsMap) {
        depsMap = {}
        effectMap.set(target, depsMap)
      }

      let deps = depsMap[key]
      if (!deps) {
        deps = new Set()
        depsMap[key] = deps
      }

      deps.add(activeEffect)

      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal

      const depsMap = effectMap.get(target)
      if (!depsMap) return

      // 解决新增加的值持续遍历的问题
      const deps = depsMap[key]
      if (deps) {
        const keys = deps.keys()

        for (let key of keys) {
          key()
        }
      }
    },
  })
}
