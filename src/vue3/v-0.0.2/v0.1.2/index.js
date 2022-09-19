const obj = { count: 2 }

Object.defineProperty(obj, 'count', {
  get: function () {
    return 3
  },
})

console.log(obj.count)  // 3
 