const map = {
  2: 4,
  3: 4,
}
let list = []
let prefix = '/vue3/effect/v0.0.'
for (let i = 0; i < 100; i++) {
  list.push(`${prefix}${i + 1}.md`)
  let other = map[i + 1]
  let count = 1
  while (other > 0) {
    list.push(`${prefix}${i + 1}.${count}.md`)
    count++
    other--
  }
}

module.exports = list
