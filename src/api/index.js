import { send } from 'api/request'

// 注册
export const sendRegisterCode = body => send('account_customer.RegisterSendPhoneCode', body)
export const registerByPhone = body => send('account_customer.RegisterByPhone', body)

// 登录
export const sendLoginCode = body => send('account_customer.LoginSendPhoneCode', body)
export const loginByPhone = body => send('account_customer.LoginByPhone', body)
export const wxLogin = body => send('account_customer.LoginByWeChat', body)

// 获取测试token
export const getTestToken = () => send('account.GetUserToken', { user_id: 1 })

// 系统配置
export const listSetting = body => send('account.ListSetting', body)
export const updateSetting = body => send('account.UpdateSetting', body)
export const addSetting = body => send('account.CreateSetting', body)

// 个人信息
export const getProfileInfo = body => send('account_customer.GetCustomerInfo', body)
export const updateProfileInfo = body => send('account_customer.UpdateCustomerInfo', body)
export const sendUpdatePhoneCode = body => send('account_customer.UpdatePhoneSendCode', body)
export const updatePhone = body => send('account_customer.UpdatePhoneVerifyCode', body)

// 换绑微信
export const bindWx = body => send('account_customer.BindCustomerWechat', body)
// 获取用户权限
export const getMyAuth = body => send('accountmgr.SearchAPIActions', body)
// 获取权限列表
export const getMyAction = body => send('account.GetMyAction', body)

export const chatApi = body => {
  return fetch('http://yygu.cn:55005/api/llm_chat', { method: 'POST' })
}
