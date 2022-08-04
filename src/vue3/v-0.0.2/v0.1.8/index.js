/**
 * 如何解决相同属性值关联的副作用函数被覆盖的问题呢？
 *
 * 我们可以看出，store使用了Map数据类型， Map由key --> Function构成。
 * 那么，我们在些基础上，可以通过扩展key --> Function中的Function部分，
 * 将Function修改为Set数据类型，这样key关联的副作用函数就可以保存多个，
 * 从而解决了关联副作用函数被覆盖的问题，
 * 为什么要使用Set数据类型呢？因为它能解决副作用函数重复添加的问题
 * 
 * 虽然执行结果显示的还是`hello world 2!`，但那是因为遍历执行的顺序问题。
 * 
 * 不过，目前 store 的数据结构确实还存在问题，明明修改的是代理对象 obj 的 text 属性，
 * 与代理对象 obj2 的 text 属性关联副作用函数 effectFn2也执行了，那有没有一种更好更
 * 明确指向关联的解决方案呢？
 */

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

function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
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
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      // const fn = store.get(key)
      // fn && fn()
      // new 2. 根据 key 从 store 中取得 effects，
      const effects = store.get(key)
      // 若 effects 不存在，则直接返回
      if (!effects) return
      // 遍历 effects ，执行副作用函数
      effects.forEach((fn) => fn())
    },
  })
}
