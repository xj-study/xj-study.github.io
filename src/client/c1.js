clickHandleByName('.btn-list-1', {
  'use-id': function () {
    showUserAction(document.getElementById('c1-id'), '通过getElementById 获取')
  },
  'use-name': function () {
    showUserAction(document.getElementsByName('c1-name'), '通过getElementsByName获取')
  },
  'use-tag': function () {
    let ele = document.getElementById('c1-tag')
    showUserAction(ele.getElementsByTagName('span'), '通过getElementsByTagName获取')
  },
  'use-class': function () {
    showUserAction(document.getElementsByClassName('c1-class'), '通过getElementsByClassName获取')
  },
  'use-selector': function () {
    showUserAction(document.querySelector('.c1-selector.test'), '通过querySelector获取')
  },
})
