import config from '@/config'
import useBaseLocalStore from '@/stores/local'
import { toLogin } from './request'

export const chat = (url, data) => {
  const baseLocalStore = useBaseLocalStore()
  if (baseLocalStore.token) {
    const baseUrl = config.apiUrl + config.apiUrlPrefix
    const apiUrl = baseUrl + url
    const body = {
      cmd: url,
      env: config.apiEnv,
      version: config.version,
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
export const chat2 = async (url, data) => {
  const baseLocalStore = useBaseLocalStore()
  if (baseLocalStore.token) {
    try {
      const baseUrl = config.apiUrl + config.apiUrlPrefix
      const apiUrl = baseUrl + url
      const body = {
        cmd: url,
        env: config.apiEnv,
        version: config.version,
        request: data,
      }
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Env: config.apiEnv,
          Authorization: `Bearer ${baseLocalStore.token}`,
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const reader = response.body.getReader()

      return new ReadableStream({
        start (controller) {
          function pump () {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }
              controller.enqueue(value)
              return pump()
            })
          }
          return pump()
        },
      })
    } catch (error) {
      console.error('Fetch error:', error)
      throw error
    }
  } else {
    toLogin()
  }
}

/** chat
try {
    const response = await writePatentDraft(body)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        sendLoading.value = false
        writeLocalStore.setSendLoading(false)
        scrollToEnd()
        break
      }
      const text = decoder.decode(value, { stream: true })
      if (isJsonString(text)) {
        const val = JSON.parse(text).content
        updateAnswerValue(item.id, val)
        scrollToEnd()
      }
    }
  } catch (error) {
    sendLoading.value = false
    writeLocalStore.setSendLoading(false)
  }
*/

/**  chat2
writePatentDraft(body).then(stream => {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let count = 0
  reader.read().then(function processText ({ done, value }) {
    if (done) {
      sendLoading.value = false
      writeLocalStore.setSendLoading(false)
      scrollToEnd()
      return
    }
    const text = decoder.decode(value, { stream: true })
    console.log(count, text)
    count++
    if (isJsonString(text)) {
      const val = JSON.parse(text).content
      updateAnswerValue(item.id, val)
      scrollToEnd()
    }
    reader.read().then(processText)
  })
}).catch(() => {
  sendLoading.value = false
  writeLocalStore.setSendLoading(false)
})
*/
