const obj = { text: 'hello world!' }

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
/**
 * 我们现在来手写一个 vue3。
 * 先考虑一下上面的这个原型，当定时任务执行时，对象 obj 的属性 text 被赋值为 'hello vue3'
 * 这个时候，视图不会自动更新，也就是 effect 不会自动执行，
 * 如何才能做到当数据发生改变时，视图也随之更新呢？
 */
