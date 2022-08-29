// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!' })
const obj2 = reactive({ text: 'hello world 2!' })

effect(function effectFn() {
  document.body.innerText = obj.text
})

effect(function effectFn2() {
  document.body.innerText = obj2.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
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
    // new 1. 根据key从store中取得 effects，它是一个 Set 类型，
    // 里面存储着所有与当前 key 相关联的副作用函数
    let effects = store.get(key)
    // 若 effects 不存在，就新建一个Set并与 key 关联
    if (!effects) {
      store.set(key, (effects = new Set()))
    }
    // 将当前激活的副作用函数添加到 store 里
    effects.add(activeEffect)
  }
}

function trigger(target, key, val) {
  // const fn = store.get(key)
  // fn && fn()
  // new 2. 根据 key 从 store 中取得 effects，
  const effects = store.get(key)
  // 若 effects 不存在，则直接返回
  if (!effects) return
  // 遍历 effects ，执行副作用函数
  effects.forEach((fn) => fn())
}
