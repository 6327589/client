import { ElLoading } from 'element-plus'
import permission from './permission'

function updateColor (el, value) {
  el.innerHTML = value
    .replace(/\[red\](.*?)\[\/red\]/g, '<span style="color: red;">$1</span>')
    .replace(/\[blue\](.*?)\[\/blue\]/g, '<span style="color: blue;">$1</span>')
}
export default (app) => {
  app.directive('loading', ElLoading.directive)
  // 权限控制指令
  app.directive('permission', permission)

  app.directive('colored-input', {
    mounted (el, binding) {
      console.log('mounted')
      updateColor(el, binding.value)
    },
    updated (el, binding) {
      console.log('updated', binding.value)
      updateColor(el, binding.value)
    },
  })
}
