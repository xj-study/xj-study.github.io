const obj = { count: 2 }

let value = 0 // 增加
Object.defineProperty(obj, 'count', {
  get: function () {
    return value // 修改
  },
  // 增加
  set: function (val) {
    value = val
  },
})

console.log(obj.count) // 0

obj.count = 4
console.log(obj.count) // 4
