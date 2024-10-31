/*
 * @Descripttion: localStorage
 */

const BASE_LOCAL_STORE = 'patent-local-store'
const WRITE_LOCAL_STORE = 'patent-write-store'
const SEARCH_LOCAL_STORE = 'patent-search-store'
const LOCAL_VERSION = 'patent-version'

export default {
  setBaseLocalStore: payload => {
    window.localStorage.setItem(BASE_LOCAL_STORE, JSON.stringify(payload))
  },
  getBaseLocalStore: () => {
    const res = window.localStorage.getItem(BASE_LOCAL_STORE)
    return res ? JSON.parse(res) : null
  },
  rmBaseLocalStore: () => {
    window.localStorage.removeItem(BASE_LOCAL_STORE)
  },

  setWriteLocalStore: payload => {
    window.localStorage.setItem(WRITE_LOCAL_STORE, JSON.stringify(payload))
  },
  getWriteLocalStore: () => {
    const res = window.localStorage.getItem(WRITE_LOCAL_STORE)
    return res ? JSON.parse(res) : null
  },
  rmWriteLocalStore: () => {
    window.localStorage.removeItem(WRITE_LOCAL_STORE)
  },

  setSearchLocalStore: payload => {
    window.localStorage.setItem(SEARCH_LOCAL_STORE, JSON.stringify(payload))
  },
  getSearchLocalStore: () => {
    const res = window.localStorage.getItem(SEARCH_LOCAL_STORE)
    return res ? JSON.parse(res) : null
  },
  rmSearchLocalStore: () => {
    window.localStorage.removeItem(SEARCH_LOCAL_STORE)
  },

  setVersion: payload => {
    window.localStorage.setItem(LOCAL_VERSION, payload)
  },
  getVersion: () => {
    return window.localStorage.getItem(LOCAL_VERSION)
  },

}
