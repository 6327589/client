import config from '@/config'

// 获取微信登录二维码
export const getWxLoginCode = (type = 'login', key = '') => {
  let redirect
  if (type === 'login') {
    redirect = config.domain + config.baseUrl + 'login'
  } else if (type === 'bindWx') {
    redirect = config.domain + config.baseUrl + 'bindWx'
  } else {
    redirect = config.domain + config.baseUrl + 'changeWx'
  }
  return new WxLogin({
    id: 'wxQrcode',
    appid: config.wxAppId,
    scope: 'snsapi_login',
    redirect_uri: redirect,
    state: Math.ceil(Math.random() * 1000000),
    style: 'black',
    href: '',
  })
}

// 加载微信js
export const loadWxLoginScript = () => {
  const script = document.createElement('script')
  script.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js'
  script.onload = () => {
    console.log('WX Login script loaded successfully')
  }
  script.onerror = () => {
    console.error('Failed to load WX Login script')
  }
  document.head.appendChild(script)
}
