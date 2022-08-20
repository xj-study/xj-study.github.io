// 全局的容器，用于存储副作用函数
// 1.将Set修改为Map，并将activeEffect声明去掉注释
const store = new Map() // 修改
let activeEffect = null // 修改

const obj = new Proxy(
  { text: 'hello world!' },
  {
    // 2.增加 getter 拦截
    get(target, key) {
      // 新增
      if (activeEffect) {
        store.set(key, activeEffect)
      }
      return target[key]
    },
    set(target, key, val) {
      target[key] = val

      // 遍历store，执行容器中的方法
      // store.forEach((fn) => fn())  // 修改

      // 3.根据key取得对应的函数，并执行
      const fn = store.get(key) // 新增
      fn && fn() // 新增
    },
  }
)

effect(function effectFn() {
  document.body.innerText = obj.text
})

effect(function consoleFn() {
  console.log('测试多次执行 effect 函数！')
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect(fn) {
  // 4.注释store.add(fn)，并将activeEffect注释去掉
  activeEffect = fn // 修改
  // store.add(fn)  // 修改
  fn()
}
