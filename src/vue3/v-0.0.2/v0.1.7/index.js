/**
 * 将数据代理部分抽离为reactive函数，
 * 按代码注释中的步骤操作。
 * 
 * 执行之后发现页面没有在1s后按预显示为hello vue3!
 * 
 * 这是为什么呢？
 * 通过分析不难发现，第二次执行effect方法时，activeEffect指向了effectFn2，然后执行effectFn2时，
 * 会访问obj2.text,这个时候会触发副作用函数收集逻辑，也就是reactive方法中的getter拦截器，这时的key
 * 值为text，而store中的键值为text的值是effectFn。当执行完`store.set(key, activeEffect)`代码
 * 时，store中text键值指向的副作用函数被修改为effectFn2。
 * 代码运行到`obj.text = 'hello vue3'`时，将触发响应数据的setter拦截器，然后根据键值text取得的是副作用
 * 函数effectFn2，并执行effectFn2，这时视图没有任何改变。
 * 
 * 那该如何解决呢？
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!' })
// new  2.声明一个新响应对象，拥有与obj同样的属性text
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

// new 1.抽离Proxy代理部分代码为reactive函数
function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      if (activeEffect) {
        store.set(key, activeEffect)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const fn = store.get(key)
      fn && fn()
    },
  })
}
