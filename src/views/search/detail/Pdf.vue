<script setup>
import { ref, onMounted } from 'vue'
import { getPatentPdfUrl, getPatentFile } from '@/api/search'
import { useRoute } from 'vue-router'

defineProps({
  detail: Object,
})

const route = useRoute()

const isLoading = ref(true)
const isNoData = ref(false)
const pdfSource = ref('')

const getPdfData = async () => {
  pdfSource.value = getPatentPdfUrl(route.params.id)
  fetch(pdfSource.value).then(response => {
    if (!response.ok) {
      isNoData.value = true
    }
  }).catch(() => {
    isNoData.value = true
  }).finally(() => {
    isLoading.value = false
  })
}

onMounted(() => {
  getPdfData()
})

</script>

<template>
  <div class="w-full h-full" v-loading="isLoading">
    <div v-if="!isNoData" class="w-full h-full flex flex-col items-center gap-4 relative overflow-auto bg-[#404040]">
      <r-pdf title="title" :url="pdfSource"></r-pdf>
    </div>
    <div  v-else class="w-full h-full flex items-center justify-center">
      <el-empty />
    </div>
  </div>
</template>
