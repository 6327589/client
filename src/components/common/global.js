/*
 * @Descripttion: 注册全局组件
 */

export default {
  install (Vue) {
    const components = import.meta.glob('./*.vue', { eager: true })
    Object.keys(components).forEach(fileName => {
      const component = components[fileName]
      const componentName = fileName.replace(/(.*\/)*([^.]+).*/ig, '$2')
      Vue.component(componentName, component.default || component)
    })
  },
}
