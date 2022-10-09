let m = new Map()
let obj = { text: 'hello world!' }
// 往 map 中添加数据
m.set(obj, 'value')
// 根据 key 取得值，此时的 key 为对象 obj
m.get(obj) // value

// 返回集合的总数
m.size // 1
// 返回对应键是否存在
m.has(obj) // true
// 删除某个键
m.delete(obj) // true

m.set(true, 'value is boolean')
m.set(obj, 'value is object')
m.set(1, 'value is number')

// 遍历 Map 的所有键
for (let i of m.keys()) {
  console.log('key', i)
}
// key true
// key { text: 'hello world!' }
// key 1

// 遍历 Map 的所有值
for (let i of m.values()) {
  console.log(i)
}
// value is boolean
// value is object
// value is number
