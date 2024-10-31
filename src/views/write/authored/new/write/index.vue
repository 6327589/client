<script setup>
import { classnames } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDirectionDraftFieldInfo, updateDirectionDraftField } from '@/api/write'
import { ElMessage } from 'element-plus'
import Disclosure from './Disclosure.vue'
import Step1 from './Step1.vue'
import Step2 from './Step2.vue'
import Step3 from './Step3.vue'
import Step4 from './Step4.vue'

const route = useRoute()

const draftId = Number(route.params.id)

const disclosureRef = ref(null)
const disclosureData = ref({})

const moduleType = ref('disclosure') // disclosure 交底书撰写，write 说明书撰写
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
    moduleType.value = 'disclosure'
  }
}

const nextButtonLoading = ref(false)
const handleNext = () => {
  if (moduleType.value === 'disclosure') {
    handleSubmitDisclosure()
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

// 提交交底书
const handleSubmitDisclosure = async () => {
  nextButtonLoading.value = true
  try {
    const data = await disclosureRef.value.submitApi()
    console.log('data11', data)
    disclosureData.value = data
    activeStep.value = 1
    moduleType.value = 'write'
    nextButtonLoading.value = false
  } catch (e) {
    nextButtonLoading.value = false
  }
}

// 保存交底书
const saveDisclosureLoading = ref(false)
const handleSaveDisclosure = async () => {
  saveDisclosureLoading.value = true
  await disclosureRef.value.saveApi()
  ElMessage.success('保存成功')
  saveDisclosureLoading.value = false
}

</script>

<template>
  <div class="w-full h-full overflow-hidden">
    <div class="container mx-auto h-full flex flex-col overflow-hidden">
      <div class="flex-grow w-full overflow-hidden">
        <!-- 交底书 -->
        <div v-if="moduleType === 'disclosure'" class="w-full h-full pt-6">
          <Disclosure ref="disclosureRef"/>
        </div>

        <!-- 撰写 -->
        <div v-else class="w-full h-full flex flex-col">
          <!-- step box -->
          <div class="flex-none w-[80%] mx-auto flex items-center py-6 gap-5">
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
                  transition-all duration-300
                  `,
                  activeStep === item.id
                  ? 'text-white border-[var(--el-color-primary)] bg-[var(--el-color-primary)]'
                  : (
                    activeStep > item.id
                    ? 'text-[var(--el-color-primary)] border-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)]'
                    : 'text-[var(--el-text-color-secondary)] border-[var(--el-text-color-secondary)] bg-white'
                  )
                )">{{ item.id }}</div>
                <span :class="classnames(`transition-all duration-300
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

          <!-- content -->
          <div class="flex-grow w-full bg-white rounded border border-light overflow-hidden">
            <Step1 v-if="activeStep === 1"
              :draftId="draftId"
              :disclosureData="disclosureData"
            />
            <Step2 v-else-if="activeStep === 2"
              :draftId="draftId"
            />
            <Step3 v-else-if="activeStep === 3"
              :draftId="draftId"
            />
            <Step4 v-else-if="activeStep === 4"
              :draftId="draftId"
            />
          </div>
        </div>
      </div>
      <div class="flex-none w-full flex items-center justify-end pt-3 pb-8">
        <el-button @click="handleSaveDisclosure" :loading="saveDisclosureLoading" v-if="moduleType === 'disclosure'">保存交底书</el-button>
        <el-button @click="handlePrev" v-if="moduleType === 'write'">上一步</el-button>
        <el-button type="primary" :loading="nextButtonLoading" @click="handleNext">下一步</el-button>
      </div>
    </div>
  </div>
</template>
