import { defineStore } from 'pinia'

const useCommonStore = defineStore({
  id: 'common',
  state: () => ({
    appLoading: true,
    layoutLoading: true,
    fieldsMap: {},
    contrastQueue: [],
    tourList: []
  }),
  getters: {
  },
  actions: {
    setAppLoading(payload) {
      this.$state.appLoading = payload
    },
    setLayoutLoading(payload) {
      this.$state.layoutLoading = payload
    },
    setFieldsMap(payload) {
      const obj = {}
      payload.forEach(item => {
        obj[item.abbreviation.toLocaleUpperCase()] = item.name_en
      })
      this.$state.fieldsMap = obj
    },
    setContrastQueue(payload) {
      this.$state.contrastQueue = payload
    },
    setTourList(element, id, description) {
      if (element) {
        if (id === 0) {
          this.$state.tourList = [{ element, id, description }]
        }
        else {
          let tourList = this.$state.tourList
          const index = tourList.findIndex(item => item.id === id)
          if (index !== -1) tourList[index].element = element
          else tourList.push({
            id,
            element,
            description
          })
          this.$state.tourList = tourList
        }
      }
    }
  },

})
export default useCommonStore
