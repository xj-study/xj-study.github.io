// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

// 1.增加一个数组，作为保存副作用函数栈来使用
const effectStack = [] // new
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
    // 重构这部分，先将 activeEffect 压入栈
    effectStack.push(activeEffect) // new
    // 将 activeEffect 指向当前副作用函数
    activeEffect = effectFn
    fn()
    // fn 执行完毕之后，将栈顶元素弹出并赋值给 activeEffect
    activeEffect = effectStack.pop() // new
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
