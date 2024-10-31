import { send, getPdf, download } from 'api/request'
import config from '@/config'

// 普通检索
export const basicSearch = body => send('aigc.BasicSearchPatent', body)
export const getPatentDetail = body => send('aigc.GetPatentInfo', body)
export const getPatentInfoHighLight = body => send('aigc.GetPatentInfoHighLight', body)
export const getPatentImages = body => send('aigc.GetPatentSearchImage', body)
export const getPatentDetailImage = body => send('aigc.GetPatentInfoImage', body)

// 历史记录
export const listSearchHistory = body => send('aigc.ListSearchHistory', body, false)
export const addSearchHistory = body => send('aigc.CreateSearchHistory', body, false)
export const deleteSearchHistory = body => send('aigc.DeleteSearchHistory', body)

// 检索帮助
export const listCustomerSearchSettings = body => send('aigc.ListCustomerSearchPatentSettings', body)

// 语义检索
export const semanticSearch = body => send('aigc.SemanticSearchPatent', body)

// pdf
export const getPatentFile = body => getPdf('aigc.GetPatentFile', body)

export const exportPatentFile = (body, defaultFilename) => download('aigc.GetPatentFile', body, defaultFilename)

export const getPatentPdfUrl = documentNumber => {
  return `${config.apiUrl + config.apiUrlPrefix}aigc.GetPatentPDF?document_number=${documentNumber}`
}
