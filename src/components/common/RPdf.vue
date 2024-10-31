<script setup>
import { computed, onMounted, ref } from 'vue'
import config from '@/config'

const props = defineProps({
  url: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
})

const loading = ref(true)
const src = computed(() => {
  // const url = 'https://yygu.cn/pdf/web/viewer.html'
  const url = location.origin + config.baseUrl + 'pdfjs/web/viewer.html'
  return `${url}?file=${encodeURIComponent(props.url)}&title=${encodeURIComponent(props.title)}`
})

onMounted(() => {
  window.addEventListener('message', function (event) {
    // 检查消息来源是否可信
    if (event.origin !== location.origin) {
      return
    }
    const message = event.data
    if (message === 'loaded') {
      loading.value = false
    }
  })
})

</script>

<template>
  <div class="w-full h-full" v-loading="loading">
    <iframe title="pdf" :src="src" frameborder="0" class="w-full h-full"></iframe>
  </div>
</template>
