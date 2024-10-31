<script setup>
import { classnames } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDisclosureWriteInfo } from '@/api/analysis'
import { ElMessage } from 'element-plus'
import Alert from './Alert.vue'

const route = useRoute()

const disclosureId = Number(route.params.id)

const pageLoading = ref(true)
const getData = () => {
  getDisclosureWriteInfo({ disclosure_id: disclosureId }).then((res) => {
    console.log('detail', res)
  }).finally(() => {
    pageLoading.value = false
  })
}

const list = ref([
  { id: 1, title: '技术领域相似度', value: '50%' },
  { id: 2, title: '背景技术相似度', value: '50%' },
  { id: 3, title: '核心技术方案相似度', value: '50%' },
  { id: 4, title: '有益效果相似度', value: '50%' },
])
const alertInfo = {
  type: 'success',
  description: '根据系统查新分析，系统认为您的技术方案在新创性上突破性较强，请点击“查新结果详情”查看具体信息。',
}
const alertInfo2 = {
  type: 'warning',
  description: '根据系统查新分析，系统认为您的技术方案在新创性方面风险较高，建议再行修改优化。',
}
onMounted(() => {
  getData()
})

</script>

<template>
  <div class="w-full h-full p-6 overflow-hidden">
    <div class="container mx-auto h-full flex flex-col overflow-hidden">
      <div class="flex flex-col w-full max-h-full overflow-hidden max-w-[900px] mx-auto
      "
        element-loading-text="正在检查，请耐心等待"
        v-loading="pageLoading"
      >
        <div class="flex-grow w-full flex bg-white rounded border border-light p-6 overflow-hidden
        ">
          <div class="w-full max-w-[736px] mx-auto">
            <Alert
              :type="alertInfo.type"
              :description="alertInfo.description"
            />
            <div class="w-full mt-6 flex items-center justify-between">
              <div class="text-lg font-semibold flex items-center gap-1">
                <span>与TOP1文件相似度</span>
                <span class="text-[var(--el-color-warning)]">25%</span>
              </div>
              <el-button text bg type="primary">
                查看TOP1文件
              </el-button>
            </div>

            <div class="w-full mt-2 px-6 py-4 rounded bg-[var(--el-fill-color-light)]">
              <div class="w-full flex gap-5">
                <div class="flex-1">
                  <h1 class="text-base font-medium">公开号</h1>
                  <h2 class="text-[var(--el-text-color-secondary)]">NX1112</h2>
                </div>
                <div class="flex-1">
                  <h1 class="text-base font-medium">公开日</h1>
                  <h2 class="text-[var(--el-text-color-secondary)]">2024-12-24</h2>
                </div>
              </div>
              <div class="mt-4 w-full flex gap-5">
                <div class="flex-1">
                  <h1 class="text-base font-medium">发明名称</h1>
                  <h2 class="text-[var(--el-text-color-secondary)]">—种基于相机投影模型的物品检测网路方法</h2>
                </div>
                <div class="flex-1">
                  <h1 class="text-base font-medium">申请人</h1>
                  <h2 class="text-[var(--el-text-color-secondary)]">张三</h2>
                </div>
              </div>
            </div>

            <div class="w-full mt-2
              flex gap-2
            ">
              <div v-for="item in list" :key="item.id"
                class="flex-1 flex flex-col items-center justify-center px-2 py-1 rounded bg-[var(--el-fill-color-light)]">
                <h1 class="font-medium text-[var(--el-color-warning)]">{{ item.value }}</h1>
                <h2 class="text-xs text-[var(--el-text-color-regular)]">{{ item.title }}</h2>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-none w-full pt-4 flex justify-end">
          <el-button class="">对比查看</el-button>
          <el-button class="" type="primary">导出报告</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
