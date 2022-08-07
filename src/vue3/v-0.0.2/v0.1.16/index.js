/**
 * 执行两次的原因是由于外层副作用函数执行时 effectFnInner 会再次注册，只不过第二次注册的
 * effectFnInner 与第一次注册的 effectFnInner 不是同一个函数，因为他们都是新创建的。
 *
 * 由于 effectFnInner 是新创建的，与已注册的副作用函数不相等，导致处理同样逻辑的副作用函数
 * 数量增加。
 * 这样，每执行一次包裹 effectFnInner 的副作用函数，对应的 effectFnInner 数量就会增加
 * 一个。
 * 由此产生的问题非常大，应该如何解决这个 bug 呢？
 *
 * 我们可以按以下思路步骤来解决。
 *
 * 第一步，重构 effect 函数，为 effectFn 增加 subEffectFns 属性，用于保存子级嵌套的
 * 副作用函数，它是数组类型。
 * 当 effect 执行时，判断 activeEffect 是否存在，若存在，说明此时 effect 是嵌套执行的，
 * 这时将当前的副作用函数 effectFn 添加到 activeEffect 的 subEffectFns 数组里，这样上级
 * effect 的副作用函数 effectFn 就持有了子级嵌套的副作用函数了。
 *
 * 第二步，就是清理子级嵌套副作用函数了，
 * 1. 为什么要清理？
 * 这个问题显而易见，如果不清理嵌套执行的副作用函数，就会导致上述的 Bug。
 * 2. 如何清理？
 * 我们知道，这里主要是需要将副作用函数从存储副作用函数的 Set 容器中清除掉，而一个副作用函数可能
 * 会被多个 Set 收集。所以，我们需要为 effectFn 增加数组类型的 deps 属性，用于收集 Set 容器。
 * 这块收集逻辑只需要在 reactive 的 getter 拦截器后增加一行代码就能实现，代码实现如下：
 * `activeEffect.deps.push(effects)`
 * 现在，只需要 effect 执行时，遍历副作用函数的 subEffectFns 列表，针对每个嵌套子副作用函数
 * 执行 cleanup 函数，它将遍历副作用函数的 deps 列表，执行每一项 Set 对象的 delete 方法，
 * 将对应副作用函数从容器中删除。
 */

const store = new Map()
console.log('store', store)

const effectStack = []
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
    // 清理子副作用函数
    cleanupSubEffects(effectFn)  // new

    if (activeEffect) {
      // 收集子副作用函数
      activeEffect.subEffectFns.push(effectFn) // new
    }

    effectStack.push(activeEffect)
    activeEffect = effectFn
    fn()
    activeEffect = effectStack.pop()
  }
  // 收集 副作用函数的容器对象
  effectFn.deps = [] // new
  // 收集 子副作用函数
  effectFn.subEffectFns = [] // new
  effectFn()
}

// 清理副作用函数相关的关联 new
function cleanup(effectFn) {
  for (let i = 0; i < effectFn.deps.length; i++) {
    const deps = effectFn.deps[i]
    deps.delete(effectFn)
  }
  effectFn.deps.length = 0
}

// 清理嵌套子副作用函数 new
function cleanupSubEffects(effectFn) {
  for (let i = 0; i < effectFn.subEffectFns.length; i++) {
    const tempEffectFn = effectFn.subEffectFns[i]
    cleanup(tempEffectFn)
  }
  effectFn.subEffectFns.length = 0
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

        // 收集当前副作用函数关联的 effects 容器
        activeEffect.deps.push(effects) // news
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const deps = store.get(target)
      if (!deps) return

      const effects = deps.get(key)
      if (!effects) return

      effects.forEach((fn) => {
        if (fn != activeEffect) fn()
      })
    },
  })
}
