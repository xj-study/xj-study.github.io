/**
 * 通过代码注释中的123步之后，基本达到了视图更新函数的动态编写，想取什么名字都可以。
 * 好了，运行一下看看效果。
 *
 * 效果如预期那样，执行的很流畅。
 *
 * 那现在这个原型就完美了吗？
 */

// new  1.增加全局变量 activeEffect
let activeEffect = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val

      // new  3. 注释掉effect()，增加判断activeEffect存在时，便执行activeEffect函数
      // effect()
      if (activeEffect) activeEffect()
    },
  }
)

// new
effect(function effectFn() {
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

// new 2.重构effect函数，接收一个方法参数fn，执行时， 将fn赋值给activeEffect
function effect(fn) {
  activeEffect = fn
  fn()
}
// function effect() {
//   document.body.innerText = obj.text
// }
