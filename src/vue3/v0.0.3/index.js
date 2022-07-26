console.log('vue3 learn start v0.0.3')
/**
 * 通过增加一个副作用函数的容器effectMap，
 * 再代理对象的 get操作，当副作用函数执行时，
 * 将对应的副作用函数以属性的key作为键，副作用函数为值的方式保存在effectMap容器里，
 * 然后在修改属性值的时候，根据对应的key，从effectMap 里取得对应的副作用函数，
 * 若副作用函数存在的话，就执行。
 * 目前的版本，effect还是写死的，这个方案只实现了一半，接下来实现另外一半。
 */
// 新增修改代码
// 收集所有有 effect
const effectMap = {}

const obj = reactive({ text: 'hello world' })

function effect() {
  document.body.innerText = obj.text
}

effect()

setTimeout(() => {
  obj.text = 'hello vue 3'
}, 1000)

function reactive(obj) {
  return new Proxy(obj, {
    // 新增修改代码
    get(target, key) {
      effectMap[key] = effect
      return target[key]
    },
    set(target, key, newVal) {
      target[key] = newVal
      // 新增修改代码
      const eft = effectMap[key]
      eft && eft()
    },
  })
}
