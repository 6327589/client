import useCommonStore from '@/stores/common'
import config from '@/config'

export default {
  // inserted: function (el, binding) {
  //   const { value } = binding
  //   if (value) {
  //     const permission = store.state.project.permission
  //     const hasPermission = permission.includes(value)
  //     if (!hasPermission) {
  //       el.parentNode && el.parentNode.removeChild(el)
  //     }
  //   } else {
  //     throw new Error('need handle! Like v-projectPermission="\'task_add\'"')
  //   }
  // },
  mounted: function (el, binding) {
    if (config.env === 'development' || config.env === 'test') {
      return
    }
    const { value } = binding
    const { action, effect } = value
    const commonStore = useCommonStore()
    const authList = commonStore.authList
    if (!authList.includes(action)) {
      if (effect === 'disabled') {
        el.setAttribute('title', '没有权限')
        el.setAttribute('disabled', true)
        el.classList.add('is-disabled')
        el.classList.add('r-disabled')
      } else {
        el.parentNode?.removeChild(el)
      }
    }
  },
}
