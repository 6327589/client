import { defineStore } from 'pinia'
import storage from 'utils/storage'

const useSearchLocalStore = defineStore({
  id: 'patent-search-local',
  state: () => ({
    history: [],
    semanticSearchValue: '',
    searchFrom: {
      country_code: [],
      type: [],
      legal_status: [],
      current_status: [],
      application_date: null,
      document_date: null,
    },
    clickItem: [],
    searchQuery: [],
  }),
  getters: {
  },
  actions: {
    setClickItem (payload) {
      this.$state.clickItem = payload
    },
    clearSearchForm () {
      this.$state.searchFrom = {
        country_code: [],
        type: [],
        legal_status: [],
        current_status: [],
        application_date: null,
        document_date: null,
      }
    },
    setSemanticSearchValue (payload) {
      this.$state.semanticSearchValue = payload
    },
    setSearchFromItems (payload) {
      this.$state.searchFrom = {
        ...this.searchFrom,
        ...payload,
      }
    },
    setSearchFromItem (key, value) {
      this.$state.searchFrom[key] = value
    },
    setSearchQuery (payload) {
      this.$state.searchQuery = payload
    },
    addHistory (item) {
      let list = [...this.$state.history]
      const index = list.findIndex(x => x === item)
      if (index > -1) {
        list.splice(index, 1)
      }
      list.unshift(item)
      if (list.length > 10) {
        list = list.filter((_, i) => i < 10)
      }
      this.$state.history = list
    },
    clearHistory () {
      this.$state.history = []
    },
  },

})

export const initSearchLocalStore = () => {
  const instance = useSearchLocalStore()
  // listen hooks
  instance.$subscribe((mutation, state) => {
    // save
    storage.setSearchLocalStore(state)
  })
  // recover
  const re = storage.getSearchLocalStore()
  if (re) {
    instance.$patch({
      ...re,
    })
  }
}

export default useSearchLocalStore
