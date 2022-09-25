const target = { text: 'hello world!' }
const proxy = new Proxy(target, {
  get(target, propKey, receiver) {
    return target[propKey]
  },
})
console.log(proxy.text)
// hello world!
console.log(proxy.foo)
// undefined

