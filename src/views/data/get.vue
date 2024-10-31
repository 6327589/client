<script setup>
import { ref } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { isJsonString } from '@/utils'
const route = useRoute()
const router = useRouter()

const handleClick1 = () => {
  fetch('http://yygu.cn:55005/api/llm_chat', { method: 'POST' })
    .then(response => {
      const reader = response.body.getReader()
      console.log('response.body', response.body)
      return new ReadableStream({
        start (controller) {
          return pump()
          function pump () {
            return reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }
              console.log('value', value)
              controller.enqueue(value)
              return pump()
            })
          }
        },
      })
    })
    .then(stream => new Response(stream))
    .then(response => response.text())
    .then(result => console.log(result))
    .catch(error => console.error(error))
}
const contentValue = ref('')
const loading = ref(false)
const handleClick = () => {
  loading.value = true
  fetch('http://yygu.cn:55005/api/llm_chat', { method: 'POST' })
    .then((response) => {
      console.log('response.body', response.body)
      return response.body
    })
    .then((rb) => {
      const reader = rb.getReader()

      return new ReadableStream({
        start (controller) {
          // The following function handles each data chunk
          function push () {
            // "done" is a Boolean and value a "Uint8Array"
            reader.read().then(({ done, value }) => {
              // If there is no more data to read
              if (done) {
                // console.log('done', done)
                controller.close()
                loading.value = false
                return
              }
              // Get the data and send it to the browser via the controller
              controller.enqueue(value)
              // Check chunks by logging to the console
              // console.log(done, value)
              new Response(value, { headers: { 'Content-Type': 'text/html' } }).text().then(result => {
                const val = JSON.parse(result).content
                console.log('111result', val)
                contentValue.value = val
              })
              push()
            })
          }

          push()
        },
      })
    })
    .then((stream) =>
    // Respond with our stream
      new Response(stream, { headers: { 'Content-Type': 'text/html' } }).text(),
    )
    .then((result) => {
    // Do things with result
      console.log('result end', result)
    })
}

const handleClick2 = () => {
  const body = {

  }
  writeField(body).then(stream => {
    // 处理流数据
    const reader = stream.getReader()
    const decoder = new TextDecoder()

    reader.read().then(function processText ({ done, value }) {
      if (done) {
        loading.value = false
        return
      }
      const text = decoder.decode(value, { stream: true })
      if (isJsonString(text)) {
        const val = JSON.parse(text).content
        console.log('val', val)
        contentValue.value = val
        // updateAnswerValue(answer.id, val)
      }
      reader.read().then(processText)
    })
  }).catch(error => {
    console.error('Error fetching data:', error)
  })
}
</script>

<template>
  <div>
    <el-button @click="handleClick" :loading="loading">Get</el-button>
    <div> {{ contentValue }}</div>
  </div>
</template>
