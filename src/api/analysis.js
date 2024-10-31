import { send } from 'api/request'

// 对比查看
export const comparePatent = body => send('aigc.ComparePatent', body)
export const comparePatentSimilarity = body => send('aigc.ComparePatentSimilarity', body)

// 交底查新
export const listPatentDisclosure = body => send('aigc.ListPatentDisclosure', body)
export const getDisclosureWriteInfo = body => send('aigc.GetDisclosureWriteInfo', body)
export const addPatentDisclosure = body => send('aigc.CreatePatentDisclosure', body)
export const deletePatentDisclosure = body => send('aigc.DeletePatentDisclosure', body)
// 修改标题
export const updatePatentDisclosureTitle = body => send('aigc.ModifyPatentDisclosureTitle', body)
// 修改内容
export const updatePatentDisclosureWrite = body => send('aigc.ModifyAllPatentDisclosureWrite', body)
