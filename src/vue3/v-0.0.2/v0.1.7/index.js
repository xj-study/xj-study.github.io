// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!' })
// new  2.声明一个新代理对象，拥有与obj同样的属性text
const obj2 = reactive({ text: 'hello world 2!' })

effect(function effectFn() {
  document.body.innerText = obj.text
})

// new 3.同样去修改body的内容
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
    store.set(key, activeEffect)
  }
}

function trigger(target, key, val) {
  const fn = store.get(key)
  fn && fn()
}
