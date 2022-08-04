console.log('vue3 learn start v0.0.5')
/**
 * 有个显而易见的问题，我们收集副作用函数的容器设计还有个很大的缺陷，
 * 如下例子所示，当存在多个不同的代理对象有相同的属性值副作用函数被收集时，
 * 最后执行的effect将会覆盖之前的，这个时候若修改被覆盖的代理对象相应属性值时，
 * 根据属性key值取得的将不是其对应的想要的副作用函数。
 */

// 收集所有有 effect
const effectMap = {}
// 当前副作用函数
let activeEffect = null

const obj = reactive({ text: 'hello world' })
const otherObj = reactive({ text: 'hello world again' })

effect(function () {
  document.body.innerText = obj.text
})

effect(function () {
  document.body.innerText = otherObj.text
})


console.log('effectMap', effectMap)

setTimeout(() => {
  obj.text = 'hello vue 3'
}, 1000)

function effect(fn) {
  activeEffect = fn
  fn()
}

function reactive(obj) {
  return new Proxy(obj, {
    // 新增修改代码
    get(target, key) {
      effectMap[key] = activeEffect
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
