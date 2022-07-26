console.log('vue3 learn start v0.0.2')
/**
 * 其实很简单，通过Proxy，代理对象set原操作，每次用户修改对象的属性时，执行一下effect 副作用函数
 * 这个原型也有问题，effect 是写死的，有没有办法使他动态起来呢？
 */
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
    set(target, key, newVal) {
      target[key] = newVal
      // 执行 effect
      effect()
    },
  })
}
