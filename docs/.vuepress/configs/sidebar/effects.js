const map = {
  2: 4,
  3: 6,
  6: 4,
}
let list = []
let prefix = '/vue3/effect/v0.0.'
for (let i = 0; i < 100; i++) {
  let other = map[i + 1]
  if (other) {
    let count = 0
    while (other >= 0) {
      list.push(`${prefix}${i + 1}.${count}.md`)
      count++
      other--
    }
  } else {
    list.push(`${prefix}${i + 1}.md`)
  }
}

module.exports = list
