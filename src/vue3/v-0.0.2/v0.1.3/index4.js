// 当前的副作用函数
let activeEffect // 新增

const obj = new Proxy(
  { text: 'hello world!' },
  {
    get(target, propKey) {
      return target[propKey]
    },
    set(target, propKey, value) {
      target[propKey] = value
      // effect()
      if (activeEffect) activeEffect() // 新增
    },
  }
)

effect(function foo() {
  document.body.innerText = obj.text
})
setTimeout(() => {
  obj.text = 'hello vue3' 
}, 1000)

function effect(fn) {
  activeEffect = fn // 新增
  fn()
}
