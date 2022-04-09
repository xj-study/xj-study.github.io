const showUserActionTimeId = {}
function showUserAction(element, message) {
  if (showUserActionTimeId[message]) return
  let length = element.length
  if (length) {
    element = element[0]
  }
  let ori = element.innerHTML
  element.innerHTML = message
  showUserActionTimeId[message] = setTimeout(() => {
    showUserActionTimeId[message] = 0
    element.innerHTML = ori
  }, 1000)
}
