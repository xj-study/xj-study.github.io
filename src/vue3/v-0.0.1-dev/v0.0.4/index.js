console.log('vue3 learn start v0.0.4')
/**
 * 通过重构 effect方法，让其接收一个函数做为参数fn，再增加一个全局变量activeEffect，
 * 当 effect 执行时，先将fn赋值给activeEffect，然后再执行fn。
 * 再修改一下对象get代理方法，当代理对象的属性被访问时，只需要简单收集activeEffect。
 * 这样就完成了副作用函数的动态化。
 */

// 收集所有有 effect
const effectMap = {}
// 当前副作用函数
let activeEffect = null

const obj = reactive({ text: 'hello world' })

effect(function(){
    document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue 3'
}, 1000)

// 重构 effect， 让副作用函数动态起来
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
      eft()
    },
  })
}
