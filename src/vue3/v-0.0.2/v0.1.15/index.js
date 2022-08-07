/**
 * 为了能让嵌套的 effect 正常执行，我们需要使用到数据结构栈，
 * 栈是一种先入后出的数据结构，是一个操作受限的线性列表。
 * 若想了解更多与数据结构相关的技术，可以查看 datastructure 边写边学系列。
 *
 * 现在，我们先增加一个数组，用于保存副作用函数的栈来使用，
 * 接着，重构 effect 函数，先将 activeEffect 压入栈，然后将当前副作用函数
 * 赋值给 activeEffect，fn 函数执行完之后，调用数组的 pop 方法，将栈顶弹出
 * 并赋值给 activeEffect。具体实现可查看下方代码。
 *
 * 这样无论 effect 调用嵌套多少层，通过栈这个数据结构，我们都能给 activeEffect
 * 设置为正确的值。
 *
 * 不过，运行之后，发现了一个很明显的问题，那就是当修改 objInner 的 text 值时，
 * 对应的 effectFnInner 执行了两次！这是为什么呢？
 */

// 全局的容器，用于存储副作用函数
const store = new Map()
console.log('store', store)

// 1.增加一个数组，作为保存副作用函数栈来使用
const effectStack = [] // new
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
    // 重构这部分，先将 activeEffect 压入栈
    effectStack.push(activeEffect) // new
    // 将 activeEffect 指向当前副作用函数
    activeEffect = effectFn
    fn()
    // fn 执行完毕之后，将栈顶元素弹出并赋值给 activeEffect
    activeEffect = effectStack.pop() // new
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

      effects.forEach((fn) => {
        if (fn != activeEffect) fn()
      })
    },
  })
}
