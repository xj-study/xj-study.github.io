const obj = { text: 'hello world!' }

// 新增
const keys = Object.keys(obj)
keys.forEach((prop) => {
  defineReactive(obj, prop)
})

// let value = obj.text
// Object.defineProperty(obj, 'text', {
//   get() {
//     return value
//   },
//   set(val) {
//     value = val
//     effect()
//   },
// })

// 新增
function defineReactive(obj, prop) {
  let value = obj[prop]
  Object.defineProperty(obj, prop, {
    get() {
      return value
    },
    set(val) {
      value = val
      effect()
    },
  })
}

effect()
setTimeout(() => {
  obj.text = 'hello vue3'
}, 1000)

function effect() {
  document.body.innerText = obj.text
}
