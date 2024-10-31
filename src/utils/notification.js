/*
 * @Descripttion: notify dialog
 */
import { ElNotification } from 'element-plus'

export const showRequestLoading = () => {

}
export const hideRequestLoading = () => {

}
export const showRequestError = (msg) => {
  ElNotification.error({ title: '接口错误提示', message: msg })
}
