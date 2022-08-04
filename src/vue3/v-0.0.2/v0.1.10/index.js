/**
 * 经过分析发现，当修改代理对象 obj 的 text 属性时，会执行对应的副作用函数 effectFn，
 * 同时，这时也会触发副作用函数注册逻辑，不过，这时 activeEffect 指向不是 effectFn，
 * 而是 effectFn2！这时就会执行 Set 的 add 方法，将 effectFn2 收集起来。
 * 此时 Set 集合的 forEach 遍历方法还没有结束，正好就遍历到了刚刚添加进去的 effectFn2
 * 函数。
 * 问题找到了就好办了，只需要解决 activeEffect 指向的问题就可以了。
 * 只需要当副作用函数执行时，activeEffect 正好指向这个正在执行的函数，就能解决这个问题了。
 * 代码实现如下：
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

let activeEffect = null

const obj = reactive({ text: 'hello world!' })
const obj2 = reactive({ text: 'hello world 2!' })

effect(function effectFn() {
  console.log('effect fn run')
  document.body.innerText = obj.text
})

effect(function effectFn2() {
  console.log('effect fn2 run')
  document.body.innerText = obj2.text
})

setTimeout(() => {
  console.log('set to hello vue3')
  obj.text = 'hello vue3'
}, 1000)

// new 重构 effect 副作用注册函数。
// 通过将 fn 的执行封装在另外一个函数里，然后 activeFn 指向这个函数，
// 这时 store 里保存的就是这个封装函数 effectFn。
// 当代理对象的属性值修改时，将会触发 effectFn 的执行，而 activeEffect
// 顺利的指向 effectFn，然后 fn 执行时，收集的也是这个函数，完美！
function effect(fn) {
  const effectFn = () => {
    activeEffect = effectFn
    fn()
  }
  effectFn()
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
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
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const deps = store.get(target)
      if (!deps) return

      const effects = deps.get(key)
      if (!effects) return

      effects.forEach((fn) => fn())
    },
  })
}


/**
 * 看上去好像能用了，哈哈，不过别高兴的太早
 */