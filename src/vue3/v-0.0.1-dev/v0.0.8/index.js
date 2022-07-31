console.log('vue3 learn start v0.0.7')

// 收集所有有 effect
const effectMap = new Map()
// 当前副作用函数
let activeEffect = null

const obj = reactive({ text: 'hello', text2: ' world' })
const otherObj = reactive({ text: 'hello world again' })

effect(function () {
  console.log('effect 1')
  document.body.innerText = obj.text + obj.text2
})

effect(function () {
  console.log('effect 2')
  document.body.innerText = otherObj.text
})

console.log('effectMap', effectMap)

setTimeout(() => {
  obj.text2 = ' vue 3'
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

      const deps = depsMap[key]
      if (deps) {
        // 解决新增加的值持续遍历执行的问题
        const newDeps = new Set(deps)
        newDeps.forEach((fn) => fn())
      }
    },
  })
}