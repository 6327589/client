<script setup>
import { ref, onMounted, computed } from 'vue'
import { getPatentFile } from '@/api/search'
import VuePdfEmbed from 'vue-pdf-embed'
import 'vue-pdf-embed/dist/styles/annotationLayer.css'
import 'vue-pdf-embed/dist/styles/textLayer.css'
import { useRoute } from 'vue-router'
import { ZoomIn, ZoomOut } from '@element-plus/icons-vue'
const props = defineProps({
  detail: Object,
})
const getPdfData = async () => {
  const res = await getPatentFile({ document_number: [route.params.id], file_type: 'pdf' })
  console.log('res,', res)
  const blob = await res.blob()
  const downloadUrl = window.URL.createObjectURL(blob)
  console.log('downloadUrl', downloadUrl)
  pdfSource.value = downloadUrl
  isLoading.value = false
}
const route = useRoute()
onMounted(() => {
  getPdfData()
})

const currentPage = ref(1)
const totalPages = ref(0)
const pdfSource = ref('')
const isLoading = ref(true)
const scale = ref(1)
const pageHeight = ref('100%')
const pageWidth = ref('70%')

const handleDocumentLoad = ({ _pdfInfo }) => {
  totalPages.value = _pdfInfo.numPages
}

const handleZoomOut = () => {
  if (scale.value >= 0.5) {
    scale.value -= 0.1
    pageWidth.value = (parseInt(pageWidth.value) + 5.0) + '%'
    pageHeight.value = (parseInt(pageHeight.value) + 5.0) + '%'
  }
}

const handleZoomIn = () => {
  if (scale.value < 2) {
    scale.value += 0.1
    pageWidth.value = (parseInt(pageWidth.value) - 5.0) + '%'
    pageHeight.value = (parseInt(pageHeight.value) - 5.0) + '%'
  }
}
</script>

<template>
  <div v-loading="isLoading" class="w-full h-full flex flex-col items-center gap-4 relative overflow-auto">
    <div
      class="absolute left-1/2 -translate-x-1/2 w-full h-[90%] text-center mb-10 overflow-auto mt-10 border-2 border-gray-600">
      <div
        :style="{ position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) scale(${scale})`, width: `${pageWidth}`, height: `${pageHeight}` }">
        <VuePdfEmbed :source="pdfSource" :page="currentPage" @loaded="handleDocumentLoad" />
      </div>
    </div>
    <div class="flex gap-4">
      <span>
        <el-button :disabled="currentPage <= 1" @click="currentPage--">❮</el-button>

        {{ currentPage }} / {{ totalPages }}

        <el-button :disabled="currentPage >= totalPages" @click="currentPage++">❯</el-button>
      </span>
      <span>
        <el-button :icon="ZoomOut" @click="handleZoomOut"></el-button>
        <el-button :icon="ZoomIn" @click="handleZoomIn"></el-button>
      </span>
    </div>
  </div>
</template>
