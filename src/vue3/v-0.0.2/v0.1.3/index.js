/**
 *
 */

// new
const activeEffecty = null

const obj = new Proxy(
  { text: 'hello world!' },
  {
    set(target, key, val) {
      target[key] = val
      effect()
    },
  }
)

// new
effect(function effectFn(){
  document.body.innerText = obj.text
})

setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

// new
function effect(fn) {
  activeEffecty = fn
  fn()
}
// function effect() {
//   document.body.innerText = obj.text
// }
