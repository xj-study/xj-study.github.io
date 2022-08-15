const obj = { text: 'hello world!' }

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
