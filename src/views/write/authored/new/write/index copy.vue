<script setup>
import { classnames } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDirectionDraftFieldInfo, updateDirectionDraftField } from '@/api/write'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'

const route = useRoute()

const draftId = Number(route.params.id)

const moduleType = ref('direction') // direction 交底书撰写，write 说明书撰写
const activeStep = ref(1)
const stepList = [
  { id: 1, name: '权利要求' },
  { id: 2, name: '说明书' },
  { id: 3, name: '说明书摘要' },
  { id: 4, name: '说明书附图' },
]

const handlePrev = () => {
  if (activeStep.value > 1) {
    activeStep.value--
  } else {
    moduleType.value = 'direction'
  }
}
const handleNext = () => {
  if (moduleType.value === 'direction') {
    activeStep.value = 1
    moduleType.value = 'write'
  } else {
    if (activeStep.value < stepList.length) {
      activeStep.value++
    }
  }
}

const pageLoading = ref(true)
const getData = () => {
  getDirectionDraftFieldInfo({ draft_id: draftId }).then((res) => {
    console.log('detail1', res)
  }).finally(() => {
    pageLoading.value = false
  })
}

onMounted(() => {
  getData()
})

</script>

<template>
  <div class="w-full h-full p-6 overflow-hidden">
    <div class="container mx-auto h-full flex flex-col overflow-hidden">
      <div class="w-full flex items-center gap-5">
        <template v-for="(item, index) in stepList" :key="item.id">
          <div v-if="index > 0" class="flex-1 h-0.5 bg-[var(--el-text-color-placeholder)]">
            <div :class="classnames(`h-full bg-[var(--el-color-primary)] transition-all duration-300
            `, activeStep >= item.id ? 'w-full' : 'w-0'
            )"></div>
          </div>
          <div class="flex-none flex justify-center"
          >
            <div :class="classnames(`
              w-6 h-6 border-2 rounded-full leading-1 flex items-center justify-center mr-3

              `,
              activeStep === item.id
              ? 'text-white border-[var(--el-color-primary)] bg-[var(--el-color-primary)]'
              : (
                activeStep > item.id
                ? 'text-[var(--el-color-primary)] border-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)]'
                : 'text-[var(--el-text-color-secondary)] border-[var(--el-text-color-secondary)] bg-white'
              )
            )">{{ item.id }}</div>
            <span :class="classnames(`
              `,
              activeStep === item.id
              ? 'text-[var(--el-color-primary)] font-bold'
              : (
                activeStep > item.id
                ? 'text-[var(--el-color-primary)]'
                : 'text-[var(--el-text-color-secondary)] '
              )
            )">
              {{ item.name }}
            </span>
          </div>
        </template>

      </div>

      <div class="w-full flex items-center justify-end ">
        <el-button @click="handlePrev" v-if="moduleType === 'write'">上一步</el-button>
        <el-button type="primary" @click="handleNext">下一步</el-button>
      </div>
    </div>
  </div>
</template>
