import axios from 'axios'
import config from '@/config'
import useBaseLocalStore from '@/stores/local'
import { showRequestError } from '@/utils/notification'

const request = axios.create({
  baseURL: config.apiUrl + config.apiUrlPrefix,
  timeout: 600000000,
  headers: {
    Env: config.apiEnv,
    'Content-Type': 'application/json',
  },
})

// 不需要验证token的接口白名单
const noAuthWhiteList = [
  'account.GetUserToken',
  'account_customer.RegisterSendPhoneCode',
  'account_customer.RegisterByPhone',
  'account_customer.LoginSendPhoneCode',
  'account_customer.LoginByPhone',
  'account_customer.LoginByWeChat',
]
// 请求拦截器
request.interceptors.request.use(config => {
  const baseLocalStore = useBaseLocalStore()
  if (baseLocalStore.token) {
    config.headers.Authorization = `Bearer ${baseLocalStore.token}`
  }
  // else {
  //   const url = config.url || ''
  //   if (!noAuthWhiteList.includes(url)) {
  //     // toLogin()
  //     return Promise.reject(new Error('not login'))
  //   }
  // }
  return config
}, error => {
  return Promise.reject(new Error(error))
})

// 响应拦截器
request.interceptors.response.use(response => {
  if (response.headers['content-type'] === 'application/pdf;charset=utf-8') return response.data
  if (response.headers['content-type'] === 'application/pdf') return response.data
  const { data } = response
  if (data.code === 0) {
    return data.Response
  } else if (data.code === 401) {
    toLogin()
  } else {
    const msg = data.message || '调用接口失败'
    response.config.showError && showRequestError(msg)
    console.log('defined: api response error: ', msg)
    return Promise.reject(new Error(msg))
  }
}, error => {
  let msg = ''
  if (error.response) {
    if (error.response.status === 401) { // 未登陆
      toLogin()
      return
    }
    if (error.response?.data?.message) {
      msg = error.response.data.message
    } else {
      msg = error.response.data
    }
  } else {
    msg = error.message
  }
  console.log('response', error)

  if (msg !== 'not login') {
    error.response.config.showError && showRequestError(msg)
  }
  console.log('undefined: api response error: ', msg)
  return Promise.reject(msg)
})

export const toLogin = () => {
  showRequestError('登录信息已过期，请重新登录')
  const baseLocalStore = useBaseLocalStore()
  baseLocalStore.setLogout()
}

export const send = (url, data, showError = true) => {
  const body = {
    cmd: url,
    env: config.apiEnv,
    version: config.version,
    request: data,
  }
  return request.post(url, body, { showError })
}
export const download = (url, data, defaultFilename) => {
  const body = {
    cmd: url,
    env: config.apiEnv,
    version: config.version,
    request: data,
  }
  const baseLocalStore = useBaseLocalStore()
  return axios({
    url: config.apiUrl + config.apiUrlPrefix + url,
    method: 'POST',
    responseType: 'blob', // 重要：将响应类型设置为 blob
    headers: {
      Env: config.apiEnv,
      Authorization: `Bearer ${baseLocalStore.token}`,
    },
    data: body,
  }).then((response) => {
    let filename = defaultFilename
    const contentDisposition = response.headers['content-disposition']
    if (contentDisposition) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/
      const matches = filenameRegex.exec(contentDisposition)
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '')
        // 处理可能的 URL 编码
        filename = decodeURIComponent(filename)
      }
    }

    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    // 清理并释放 URL 对象
    window.URL.revokeObjectURL(downloadUrl)
  }).catch((error) => {
    console.error('下载文件时出错:', error)
    throw error
  })
}

export const _download = (url, query) => {
  return request.get(url, { params: query, responseType: 'blob' })
}

export const _upload = (url, data, currentConfig) => {
  const formData = new FormData()
  for (const key in data) {
    formData.append(key, data[key])
  }
  return request.post(url, formData, currentConfig)
}

export const getPdf = (url, data) => {
  const baseLocalStore = useBaseLocalStore()
  if (baseLocalStore.token) {
    const baseUrl = config.apiUrl + config.apiUrlPrefix
    const apiUrl = baseUrl + url
    const body = {
      cmd: url,
      env: config.apiEnv,
      request: data,
    }
    return fetch(apiUrl, {
      method: 'POST',
      headers: {
        Env: config.apiEnv,
        Authorization: `Bearer ${baseLocalStore.token}`,
      },
      body: JSON.stringify(body),
    })
  } else {
    toLogin()
  }
}
