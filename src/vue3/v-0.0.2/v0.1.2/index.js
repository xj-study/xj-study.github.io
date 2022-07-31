/**
 * vue3基本上是这么干的：
 * 通过 Proxy，我们可以拦截对象的一些原子操作，如 getter、setter 等。
 * 现在，我们通过拦截对象的 setter 操作，当对象的属性值被赋值时，便去执行 effect 函数！
 * 这样就可以做到，当对象的属性值改变时，视图就跟着更新了。
 *
 * 好了，一个简单的数据响应框架原型就写完了。
 * 当然，这个原型有个显而易见的问题，effect 是硬编码的，用户完全可以将视图修改的函数写成 myEffect 等等。
 *
 * 那有没有办法解决这个问题呢？
 */

// new
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
