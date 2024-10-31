import version from './version.js'

const ENV = import.meta.env
console.log(`version: ${version}`)
export default {
  version,
  env: ENV.MODE, // development test production
  apiEnv: ENV.MODE === 'production' ? 'prod' : 'test',
  apiUrl: ENV.VITE_API_URL,
  apiUrlPrefix: '/v6/',
  baseUrl: import.meta.env.BASE_URL, //  /client/
  wxAppId: ENV.VITE_WX_APPID,
  domain: ENV.VITE_DOMAIN,
}
