/**
 * 传统做法：
 * 数据修改后，再次调用 effect 函数，视图就更新了
 * 
 * 这种方式视图的更新是依赖于我们主动调用的，
 * 那有没有可能，当 obj.text 被修改后，就去自动
 * 调用 effect 函数，自动更新视图呢？
 * 当然有，目前主流的框架都这么干了。
 */

const obj = { text: 'hello world!' }

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
  effect()
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
