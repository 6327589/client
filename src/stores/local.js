import { defineStore } from 'pinia'
import storage from 'utils/storage'
import { getImgUrl } from '@/utils'
import router from '@/router'

const useBaseLocalStore = defineStore({
  id: 'patent-base-local',
  state: () => ({
    token: '',
    userInfo: {
      uid: 0,
      name: '',
      avatar: '',
      phone: '',
      bindWechat: false,
      createdAt: '',
    },
    pageOptions: {},
    pageSize: 10,
  }),
  getters: {
  },
  actions: {
    setPageSize(payload) {
      this.$state.pageSize = payload
    },
    setLogin(payload) {
      this.$state.token = payload.jwt_token
      this.$state.userInfo = {
        uid: payload.user_info.uid,
        name: payload.user_info.name,
        avatar: payload.user_info.avatar_url || getImgUrl('avatar.png'),
        phone: payload.user_info.phone,
        bindWechat: payload.user_info.bind_wechat,
        createdAt: payload.user_info.created_at,
        is_write_draft: payload.user_info.is_write_draft
      }
    },
    updateUserInfo(payload) {
      this.$state.userInfo = {
        uid: payload.uid,
        name: payload.name,
        avatar: payload.avatar_url || getImgUrl('avatar.png'),
        phone: payload.phone,
        bindWechat: payload.bind_wechat,
        createdAt: payload.created_at,
      }
    },
    updateUserInfoItems(payload) {
      this.$state.userInfo = {
        ...this.$state.userInfo,
        ...payload,
      }
    },
    setLogout() {
      storage.rmBaseLocalStore()
      this.$state.token = ''
      this.$state.userInfo = {
        uid: 0,
        name: '',
        avatar: '',
        phone: '',
        bindWechat: false,
        createdAt: '',
      }
      router.push({ name: 'Login' })
    },

    setPageOption(tableName, data) {
      this.$state.pageOptions[tableName] = data
    },
    rmPageOption(tableName) {
      delete this.$state.pageOptions[tableName]
    },
    clearPageOption() {
      this.$state.pageOptions = null
    },
  },

})

export const initBaseLocalStore = () => {
  const instance = useBaseLocalStore()
  // listen hooks
  instance.$subscribe((mutation, state) => {
    // save
    storage.setBaseLocalStore(state)
  })
  // recover
  const re = storage.getBaseLocalStore()
  if (re) {
    instance.$patch({
      ...re,
    })
  }
}

export default useBaseLocalStore
