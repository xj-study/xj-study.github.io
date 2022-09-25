const target = { text: 'hello world!' }
const proxy = new Proxy(target, {
  get(target, propKey, receiver) {
    console.log('get', propKey) // 新增
    return target[propKey]
  },
})
console.log(proxy.text)
// get text   // 新增
// hello world!
console.log(proxy.foo)
// get foo    // 新增
// undefined
