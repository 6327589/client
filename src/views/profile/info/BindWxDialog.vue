<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { regExpPhone } from 'utils/validate'
import { ElMessage } from 'element-plus'
import { loadWxLoginScript, getWxLoginCode } from 'utils/wx'
import useBaseLocalStore from '@/stores/local'

const emits = defineEmits(['update:visible'])
const props = defineProps({
  visible: Boolean,
  type: {
    type: String,
    default: 'bindWx',
  },
})

const thisVisible = ref(false)

const loadCodeLoading = ref(false)

watch(() => props.visible, val => {
  if (val) {
    thisVisible.value = val
    getCode()
  } else {
    loadCodeLoading.value = false
  }
})
watch(thisVisible, val => {
  emits('update:visible', val)
})

onMounted(() => {
  loadWxLoginScript()
})

const getCode = () => {
  loadCodeLoading.value = true
  nextTick(() => {
    getWxLoginCode(props.type)
    document.querySelector('#wxQrcode').getElementsByTagName('iframe')[0].onload = () => {
      loadCodeLoading.value = false
    }
  })
}

</script>

<template>
  <el-dialog v-model="thisVisible" class="w-[480px]" :title="type === 'bindWx' ? '绑定微信' : '换绑微信'">
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-center mb-[15px] text-xl">{{ type === 'bindWx' ? '绑定微信' : '换绑微信' }}</h1>
      <div class="w-[300px] h-[300px] overflow-hidden">
        <div v-loading="loadCodeLoading" className="mt-[-47px] w-[300px] h-[400px] relative">
          <div id="wxQrcode"></div>
        </div>
      </div>
      <div class="text-center text-[13px]">
        <p>使用微信扫一扫{{type === 'bindWx' ? '绑定' : '换绑'}}微信</p>
        <p>“言古科技专利助手”</p>
      </div>
    </div>
  </el-dialog>
</template>
