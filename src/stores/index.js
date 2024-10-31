import { initBaseLocalStore } from './local'
import { initWriteLocalStore } from './write'
import { initSearchLocalStore } from './search'
import storage from '@/utils/storage'
import config from '@/config'

export const initLocalStore = () => {
  initBaseLocalStore()
  initSearchLocalStore()
  if (config !== storage.getVersion()) {
    storage.setVersion(config.version)
  }
  storage.rmWriteLocalStore()
  initWriteLocalStore()
}
