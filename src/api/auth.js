import { send } from 'api/request'

// 员工管理
export const listEmployee = body => send('account.ListEmployee', body)
export const getEmployee = body => send('account.GetEmployeeDetail', body)
export const addEmployee = body => send('account.CreateEmployee', body)
export const updateEmployee = body => send('account.ModifyEmployeeInfo', body)
export const deleteEmployee = body => send('account.DeleteEmployee', body)
// 绑定微信
export const bindWx = body => send('account.BindEmployeeWechat', body)
export const getBindWxKey = body => send('account.GetEmployeeBindKey', body)

// 角色
export const getRole = body => send('account.GetPositionDetail', body)
export const listRole = body => send('account.ListPosition', body)
export const addRole = body => send('account.CreatePosition', body)
export const deleteRole = body => send('account.DeletePosition', body)
export const updateRoleBaseInfo = body => send('account.ModifyPositionInfo', body)
export const updateRolePrivilege = body => send('account.ModifyPositionPrivilege', body)

// 权限
export const listPrivilege = body => send('account.ListPrivilege', body)
export const addPrivilege = body => send('account.CreatePrivilege', body)
export const deletePrivilege = body => send('account.DeletePrivilege', body)
export const updatePrivilege = body => send('account.ModifyPrivilege', body)
