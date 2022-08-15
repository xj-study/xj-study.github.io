/**
 * 我们现在考虑一种情况，当存在分支条件判断时，副作用函数的相关依赖收集就需要再处理一番。
 * 如下代码所示：
 * `
 * document.body.innerText = obj.isUseText ? obj.text : obj.text2  // new
 * `
 * 首次执行之后， 这时 isUseText 为 true，store 中的对应关系如下：
 *
 * store ->
 *    obj ->
 *        text -> effectFn
 *
 * 1s后，定时任务t1执行，这时的 isUseText 为 false，store 中的对应关系将变化如下：
 *
 * store ->
 *    obj ->
 *        text  -> effectFn
 *        text2 -> effectFn
 *
 * 我们发现，这时 text 与 effectFn 的关联应该删除掉，不然将会导致1.5s后定时任务t2执行
 * 后 effectFn 的执行。
 *
 * 我们只需要在 effectFn 执行时，先清理一波，代码如下：
 * `
 * cleanup(effectFn) // new
 * `
 *
 * 这样的话，store 中的变化大概如下：
 *
 * 1.
 * store ->
 *    obj ->
 *        text  -> effectFn  x
 *
 * 2.
 * store ->
 *    obj ->
 *        text2 -> effectFn
 *
 * 执行之后，发现运行进入死循环了！
 *
 * 产生这个问题的原因，还是由于数据结构 Set 的遍历特性，当遍历还没有结束时，这时增加一个新
 * 元素时，Set 会继续遍历这个新元素。
 * 而现在我们先是从 Set 中删除这个副作用函数，之后又将这个副作用函数添加进去，就将导致死循环。
 *
 * 解决这个问题的方法很简单，只需要生成一个新的集合对象，取得旧集合中的不是当前副作用函数其它函数，
 * 再遍历执行这个新的集合对象。
 */

const store = new Map()
console.log('store', store)

const effectStack = []
let activeEffect = null

const obj = reactive({ text: 'hello world!', text2: 'hello world 2!', isUseText: true })

effect(function effectFn() {
  console.log('effect fn run')
  document.body.innerText = obj.isUseText ? obj.text : obj.text2 // new
})

setTimeout(function t1() {
  console.log('set to use text')
  obj.isUseText = false
}, 1000)

setTimeout(function t2() {
  console.log('set to text value vue3')
  obj.text = 'hello vue3!'
}, 1500)

function effect(fn) {
  const effectFn = () => {
    // 清理关联
    cleanup(effectFn) // new
    // 清理子副作用函数
    cleanupSubEffects(effectFn)

    if (activeEffect) {
      // 收集子副作用函数
      activeEffect.subEffectFns.push(effectFn)
    }

    effectStack.push(activeEffect)
    activeEffect = effectFn
    fn()
    activeEffect = effectStack.pop()
  }
  // 收集 副作用函数的容器对象
  effectFn.deps = []
  // 收集 子副作用函数
  effectFn.subEffectFns = []
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
        activeEffect.deps.push(effects)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const deps = store.get(target)
      if (!deps) return

      const effects = deps.get(key)
      if (!effects) return

      // new
      const toRunEffects = new Set()
      effects.forEach((fn) => {
        if (fn != activeEffect) toRunEffects.add(fn)
      })
      toRunEffects.forEach((fn) => fn())

      // effects.forEach((fn) => {
      //   if (fn != activeEffect) fn()
      // })
    },
  })
}
