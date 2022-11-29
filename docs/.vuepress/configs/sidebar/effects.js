const map = {
  1: {
    2: 4,
    3: 6,
    6: 5,
  },
}

function createVlist(v, size) {
  let list = []
  let prefix = `/vue3/effect/v0.${v}.`

  for (let i = 0; i < size; i++) {
    let other = map[v][i + 1]
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

  return { text: `版本${v}`, children: list }
}

function createVData(v, size) {
  let children = []
  let prefix = `/vue3/effect/v${v}`

  for (let i = 0; i < size; i++) {
    children.push(`${prefix}/v${v}.${i}.md`)
  }
  return { text: `version ${v}.0`, collapsible: true, children }
}

module.exports = {
  index: '/vue3/effect/README.md',
  v1: createVData(1, 10),
  v2: createVData(2, 10),
  v3: createVData(3, 10),
}
