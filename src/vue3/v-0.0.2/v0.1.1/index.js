/**
 * 传统做法：
 * 数据修改后，再次调用 effect 函数，视图就更新了
 * 
 * 这种方式视图的更新是依赖于我们主动去调用执行，
 * 那有没有可能，当 obj.text 被修改后，就会自动调用 effect 函数，从而更新视图呢？
 * 
 * 当然有，目前主流的框架都是这么做的。
 */

const obj = { text: 'hello world!' }

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
  // new
  effect()
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
