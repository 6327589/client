import { send, download } from './request'
import { chat } from './chat'

export const listPatentDraft = body => send('aigc.ListPatentDraft', body)
export const addPatentDraft = body => send('aigc.CreatePatentDraft', body)
export const renamePatentDraft = body => send('aigc.ModifyPatentDraftTitle', body)
export const deletePatentDraft = body => send('aigc.DeletePatentDraft', body)
// 获取菜单
export const listPatentDraftMenu = body => send('aigc.ListCustomerPatentDraftField', body)
// 撰写专利
export const writePatentDraft = body => chat('aigc.WritePatentDraft', body)

// 获取会话
export const listPatentDraftChat = body => send('aigc.ListDraftChat', body)
export const clearPatentDraftChat = body => send('aigc.ClearPatentDraftFieldChat', body)
export const deletePatentDraftChat = body => send('aigc.DeletePatentDraftFieldChat', body)

// 预览
export const listRecord = body => send('aigc.ListDraftRecord', body)
export const createRecord = body => send('aigc.CreateDraftRecord', body)
export const updateRecord = body => send('aigc.ModifyDraftRecord', body)

//  润色
export const runPolish = body => send('aigc.CreatePatentDraftPolish', body)
// 获取润色列表
export const listPolish = body => send('aigc.GetPatentDraftPolish', body)
export const updatePolishContent = body => send('aigc.ModifyPatentDraftPolish', body)

// 导出
export const exportPatentToPDF = (body, filename) => download('aigc.ExportPatentToPDF', body, filename)
export const exportPatentToWord = (body, filename) => download('aigc.ExportPatentToWord', body, filename)
export const exportPatentToXML = (body, filename) => download('aigc.ExportPatentToXML', body, filename)

// 一键式撰写
// 获取交底书内容
export const getDirectionDraftFieldInfo = body => send('aigc.GetDirectionDraftFieldInfo', body)
export const updateDirectionDraftField = body => send('aigc.WriteDirectionDraftField', body)
// 获取权利要求
export const getDirectionDraftClaimInfo = body => send('aigc.GetDirectionDraftClaimInfo', body)
