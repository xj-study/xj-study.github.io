/**
 * vue3是这么干的：
 * 通过 Proxy，我们可以代理重写对象的原子操作，如 setter 等。
 * 现在，我们通过重写对象的 setter 操作，当对象的属性值被赋值时，
 * 就会执行 effect 函数！
 */

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val
      effect()
    },
  }
)

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
