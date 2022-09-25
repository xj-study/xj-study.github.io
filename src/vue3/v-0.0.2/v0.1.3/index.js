const obj = new Proxy(
  { text: 'hello world!' },
  {
    get(target, propKey) {
      return target[propKey]
    },
    set(target, propKey, value) {
      target[propKey] = value
      effect()
    },
  }
)

effect()
setTimeout(() => {
  obj.text = 'hello vue3' 
}, 1000)

function effect() {
  // document.body.innerText = obj.text
  foo()
}

function foo() {
  document.body.innerText = obj.text
}
