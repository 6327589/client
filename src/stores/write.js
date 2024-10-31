import { defineStore } from 'pinia'
import storage from 'utils/storage'
import { listPatentDraftMenu } from '@/api/write'

const useWriteLocalStore = defineStore({
  id: 'patent-write-local',
  state: () => ({

    isLeadedList: [],

    fieldMap: null,
    sendLoading: false,
  }),
  getters: {
  },
  actions: {
    async syncMenu () {
      if (!this.fieldMap) {
        const apis = [
          listPatentDraftMenu({ category: 'claim' }),
          listPatentDraftMenu({ category: 'description' }),
          listPatentDraftMenu({ category: 'abstract' }),
        ]
        const [claimMenu, descriptionMenu, abstractMenu] = await Promise.all(apis)
        const field1 = getField(claimMenu.Data || [])
        const field2 = getField(descriptionMenu.Data || [])
        const field3 = getField(abstractMenu.Data || [])
        this.$state.fieldMap = {
          ...field1,
          ...field2,
          ...field3,
        }
      }
    },

    setSendLoading (value) {
      this.$state.sendLoading = value
    },
    setIsLeadedList (payload) {
      this.$state.isLeadedList = payload
    },

  },

})

export const initWriteLocalStore = () => {
  const instance = useWriteLocalStore()
  // listen hooks
  instance.$subscribe((mutation, state) => {
    // save
    storage.setWriteLocalStore(state)
  })
  // recover
  const re = storage.getWriteLocalStore()
  if (re) {
    instance.$patch({
      ...re,
    })
  }
}

export default useWriteLocalStore

const getField = (list) => {
  const obj = {}
  list.forEach((x, i) => {
    x.items.forEach(xx => {
      const item = {
        fieldId: xx.ID,
        key: xx.key,
        start_prompt: xx.start_prompt,
        tip: xx.placeholder,
        min_word: xx.min_word,
      }
      if (xx.name_zh) {
        item.label = xx.name_zh
      } else {
        item.label = xx.paragraph
      }
      obj[xx.ID] = item
    })
  })
  return obj
}
