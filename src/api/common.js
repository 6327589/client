import { _upload } from 'api/request'

export const uploadImage = (body, config) => _upload('user.UploadImageGeneral', body, config)
export const uploadDoc = (body, config) => _upload('account.UploadFormDoc', body, config)

export const uploadAvatarImage = (body, config) => _upload('account_customer.UploadAvatarImage', body, config)
