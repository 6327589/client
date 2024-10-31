<script setup>
import { ref, watch } from 'vue'
import { exportPatentToPDF, exportPatentToWord, exportPatentToXML } from '@/api/write'

const emits = defineEmits(['update:visible'])
const props = defineProps({
  visible: Boolean,
  draftId: Number,
})

const thisVisible = ref(false)

watch(() => props.visible, val => {
  if (val !== thisVisible.value) {
    thisVisible.value = val
  }
}, { immediate: true })
watch(thisVisible, val => {
  console.log('visible', val)
  emits('update:visible', val)
})

const formData = ref({
  type: 'docx',
})

const submitLoading = ref(false)
const handleCancel = () => {
  thisVisible.value = false
}

const docList = [
  { label: 'Word', value: 'docx' }, // 发明公开 + 发明授权
  { label: 'PDF', value: 'pdf' },
  { label: 'XML', value: 'xml' },
]

const handleSubmit = async () => {
  submitLoading.value = true
  const body = {
    draft_id: props.draftId,
  }
  const filename = '专利'
  try {
    if (formData.value.type === 'docx') {
      await exportPatentToWord(body, filename + '.docx')
    } else if (formData.value.type === 'pdf') {
      await exportPatentToPDF(body, filename + '.pdf')
    } else if (formData.value.type === 'xml') {
      await exportPatentToXML(body, filename + '.xml')
    }
    handleCancel()
  } catch (err) {
    console.log(err)
  }
  submitLoading.value = false
}

</script>

<template>
  <el-dialog v-model="thisVisible" class="w-[480px] range-dialog" title="导出专利" :close-on-click-modal="false">
    <el-form class="w-full" :model="formData">
      <el-form-item label="文档类型：">
        <el-select v-model="formData.type" placeholder="请选择">
          <el-option v-for="item in docList" :key="item.value" :value="item.value" :label="item.label"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
