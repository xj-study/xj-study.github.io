console.log('vue3 learn start v0.0.1')
/**
 * 考虑一下这个最简原型，我们该如何实现，当 obj.text 值改变时，视图也随之更新
 */

const obj = { text: 'hello world' }

function effect() {
  document.body.innerText = obj.text
}

effect()

setTimeout(() => {
  obj.text = 'hello vue 3'
}, 1000)
