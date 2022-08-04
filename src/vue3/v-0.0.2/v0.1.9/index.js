/**
 * 如何解决数据响应时，副作用函数执行不够精确的问题呢？
 *
 * 我们可以发现，effect 函数执行时，存在以下三个角色
 * 1. 使用effect函数注册的副作用函数
 * 2. 被读取的代理对象
 * 3. 被读取的字段名
 * 只需要组织好上述三个角色，就能做到精确响应执行。
 *
 * 如果用 target 来表示被读取的代理对象，用 key 来表示被读取的字段名，
 * 用 effectFn 来表示被注册的副作用函数，那么可以为这三个角色建立如下
 * 关系：
 * target -> key -> effectFn
 *
 * 这就是一个树状结构，
 * effectFn 存储可以使用 Set
 * 存储 key -> Set 可以使用 Map
 * 存储 target -> Map 可以使用 Map
 *
 * 代码实现如下：
 * 
 * 对比于上一个版本，只是增加了 target 这一层。
 *
 * 执行之后，发现运行结果并不是预料中的 
 * `hello vue3`
 * 
 * 增加几条 log，运行之后，查看打印的 log：
 * `
 * store Map(0) {size: 0}
 * effect fn run
 * effect fn2 run
 * set to hello vue3
 * effect fn run
 * effect fn2 run
 * `
 * 这是为什么？
 * 为什么 effectFn 和 effectFn2 都执行了？
 * 根据现在的数据结构，修改代理对象 obj 的 text 值时，应该只会执行 effectFn，
 * 现在 effectFn2 也执行了！
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

function effect(fn) {
  activeEffect = fn
  fn()
}

function reactive(target) {
  return new Proxy(target, {
    get(target, key) {
      if (activeEffect) {
        // 根据target从store中取得 deps，它是一个 Map 类型，
        // 里面存储着所有与当前 key 相关联的副作用函数
        let deps = store.get(target)
        // 若 deps 不存在，就新建一个Map并与 target 关联
        if (!deps) {
          store.set(target, (deps = new Map()))
        }

        // 根据key从deps中取得 effects，它是一个 Set 类型
        let effects = deps.get(key)
        // 若 effects 不存在，就新建一个Set并与 key 关联
        if (!effects) {
          deps.set(key, (effects = new Set()))
        }

        // 将当前激活的副作用函数添加到 store 里
        effects.add(activeEffect)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      const deps = store.get(target)
      if (!deps) return

      // 根据 key 从 deps 中取得 effects，
      const effects = deps.get(key)
      // 若 effects 不存在，则直接返回
      if (!effects) return

      // 遍历 effects ，执行副作用函数
      effects.forEach((fn) => fn())
    },
  })
}
