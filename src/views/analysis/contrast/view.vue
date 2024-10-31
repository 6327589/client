<script setup>
import { getImgUrl } from '@/utils'
import { useRouter } from 'vue-router'
import { onMounted, ref } from 'vue'
import useCommonStore from '@/stores/common'
import { getPatentDetail } from '@/api/search'
import { Remove } from '@element-plus/icons-vue'
import { comparePatent, comparePatentSimilarity } from '@/api/analysis'
import { ElMessage } from 'element-plus'
import ForbiddenIcon from '@/assets/icons/forbidden.svg'
const commonStore = useCommonStore()
const router = useRouter()
const loading = ref(true)
const selectType = {
  0: [
    { id: 1, img: getImgUrl('database1.png'), routeName: 'Search_General', title: '数据库选择专利' },
    { id: 2, img: getImgUrl('write1.png'), routeName: 'Analysis_Contrast_Write', title: '直接撰写' },
  ],
  1: [
    { id: 1, img: getImgUrl('database2.png'), routeName: 'Search_General', title: '数据库选择专利' },
    { id: 2, img: getImgUrl('write2.png'), routeName: 'Analysis_Contrast_Write', title: '直接撰写' },
  ],
}

const handleGoPage = (routeName) => {
  router.push({ name: routeName })
}
const contrastList = [{
  id: 0,
  title: '对比查看1',
  selectType: selectType[0],
},
{
  id: 1,
  title: '对比查看2',
  selectType: selectType[1],
}]

const patentData = ref([])
const handleGetPatent = async () => {
  let patents = commonStore.contrastQueue
  patents = patents.map(async (item, index) => {
    let data
    if (item.type === 'database') {
      const res = await getPatentDetail({ document_number: item.docId })
      data = {
        id: res.document_number,
        title: res.title,
        application_number: res.application_number, // 申请号
        application_date: res.application_date, // 申请日
        document_number: res.document_number, // 公开公告号
        document_date: res.document_date, // 公开公告日
        applicant: res.applicant.join('，'), // 申请人, array
        first_applicant: res.first_applicant, // 第一申请人
        inventor: res.inventor.join('，'), // 发明人, array
        ipc: res.ipc.join('，'), // ipc分类号, array
        summary: res.abstract, // 摘要
        description: res.description, // 说明书
        claims: res.claims, // 权利要求
      }
    } else {
      data = {
        ...(patents[index].content),
        claims: patents[index].content.claims.map(x => `${x.id + 1}. ${x.content}`).join('\n'),
      }
    }
    return {
      type: item.type,
      data,
      currentMenu: item.type === 'database' ? 'summary' : 'claims',
    }
  })
  return patents
}
const initData = async () => {
  const res = await handleGetPatent()
  patentData.value = await Promise.all(res)
  patentData.value.map((item, index) => {
    const firstTabName = item.type === 'database' ? 'summary' : 'claims'
    textData[index] = item.data[firstTabName]
  })
  loading.value = false
}

const handleSplitClaims = (claims) => {
  const res = claims.split(/(\d+)\./)
  const claimArr = []
  res.map((item, index) => {
    if (index && index % 2 === 0) claimArr.push(item)
  })
  return claimArr
}
onMounted(() => {
  initData()
})
// 移除对比列
const removeContrastQueue = async (id) => {
  loading.value = true
  let queue = commonStore.contrastQueue
  const index = queue.findIndex(item => {
    return item.id === id
  })
  queue.splice(index, 1)
  queue = queue.map((x, index) => ({ ...x, id: index }))
  commonStore.setContrastQueue(queue)
  ElMessage({
    type: 'success',
    message: '成功剔除',
  })
  isTextContrast.value = false
  await initData()
}

const tabList = [
  [
    { id: 1, label: '摘要', name: 'summary' },
    { id: 2, label: '权利要求', name: 'claims' },
    { id: 3, label: '说明书', name: 'description' },
  ],
  [
    { id: 1, label: '权利要求', name: 'claims' },
    { id: 2, label: '技术领域', name: 'field' },
    { id: 3, label: '所解决的技术问题', name: 'question' },
    { id: 4, label: '预期效果', name: 'effect' },
  ],
]
const handleTabChange = (val, index) => {
  isComputed.value = false
  if (index === 0) { textData[0] = patentData.value[index].data[val] } else textData[1] = patentData.value[index].data[val]
  handleComparePatent()
}
const isComputed = ref(false)
const isTextContrast = ref(false)
const textData = []
const resHTML = ref({
  left_html: '',
  right_html: '',
})
const similarity = ref()
const handleComparePatent = async () => {
  if (commonStore.contrastQueue.length < 2 || !isTextContrast.value) return
  loading.value = true
  const res = await comparePatent({ left_text: textData[0], right_text: textData[1] })
  resHTML.value.left_html = res.left_text
  resHTML.value.right_html = res.right_text
  loading.value = false
}

const handleComputeSimilarity = async () => {
  isComputed.value = true
  if (commonStore.contrastQueue.length < 2) return
  const res = await comparePatentSimilarity({ left_text: textData[0], right_text: textData[1] })
  similarity.value = res.similarity
}

</script>

<template>
    <div class="w-full h-full flex p-4" v-loading="loading">
        <div class="w-full h-full bg-white flex">
            <div v-for="(contrastData, index) in contrastList" :key="contrastData.id"
                class="flex-1 border-r border-[#E4E7ED]">
                <el-tabs v-if="!patentData[index]" type="border-card">
                    <el-tab-pane class="flex justify-center gap-10" :label="contrastData.title">
                        <div v-for="(type, index) in contrastData.selectType" :key="index" class="
                        w-[280px] h-[126px] rounded-[16px] bg-[#F5F7FA] flex flex-col justify-center items-center gap-y-4
                        hover:[box-shadow:0px_8px_20px_#00000014,_0px_12px_32px_4px_#0000000a]
                        hover:bg-white" @click="handleGoPage(type.routeName)">
                            <img :src="type.img" alt="">
                            <h3>{{ type.title }}</h3>
                        </div>
                    </el-tab-pane>
                </el-tabs>
                <div class="w-full h-full flex flex-col overflow-hidden relative pt-4" v-else>
                    <div class="flex-none h-20 px-4 py-2 flex flex-col gap-y-4">
                        <template v-if="patentData[index].type === 'database'">
                            <div class="flex">
                                <div class="w-18 text-[var(--el-text-color-regular)]">专利号：</div>
                                <div class="font-medium text-[#303133]">{{ patentData[index].data.id }}</div>
                            </div>
                            <div class="flex">
                                <div class="w-18 text-[var(--el-text-color-regular)]">专利名称：</div>
                                <div class="font-medium text-[#303133]">{{ patentData[index].data.title }}</div>
                            </div>
                        </template>
                        <template v-else>
                            直接撰写
                        </template>
                        <el-button :icon="Remove" type="primary" class="absolute top-4 right-4"
                            @click="removeContrastQueue(index)">剔除对比列</el-button>
                    </div>
                    <el-tabs type="border-card" class="flex-grow overflow-hidden flex"
                        @tab-change="(name) => handleTabChange(name, index)" v-model="patentData[index].currentMenu">
                        <template v-if="patentData[index].type === 'database'">
                            <el-tab-pane v-for="tab in tabList[0]" :key="tab.id" :label="tab.label"
                                class="whitespace-pre-line" :name="tab.name">
                                <div v-if="!isTextContrast">{{ patentData[index].data[tab.name] }} </div>
                                <div v-else v-html="index === 0 ? resHTML.left_html : resHTML.right_html"></div>
                            </el-tab-pane>
                        </template>
                        <template v-else>
                            <el-tab-pane v-for="tab in tabList[1]" :key="tab.id" :label="tab.label"
                                class="whitespace-pre-line" :name="tab.name">
                                <div v-if="!isTextContrast">{{ patentData[index].data[tab.name] }} </div>
                                <div v-else v-html="index === 0 ? resHTML.left_html : resHTML.right_html"></div>
                            </el-tab-pane>
                        </template>
                        <!-- <el-tab-pane label="附图">
                        </el-tab-pane>
                        <el-tab-pane label="PDF">
                        </el-tab-pane> -->
                    </el-tabs>
                </div>
            </div>
        </div>
        <div v-if="commonStore.contrastQueue.length === 2" class="w-[220px] -my-4 ml-4 p-4 bg-white ">
            <div class="mb-5">
                <el-button type="primary" plain @click="handleComputeSimilarity">计算相似度</el-button>
                <div class="mt-3 h-[50px] bg-[#F5F7FA] rounded-[8px] flex flex-col justify-center items-center">
                    <span v-if="isComputed" class="text-[#E6A23C]">{{ `${(similarity * 100).toFixed(2)}% `
                        }}</span>
                    <forbidden-icon v-else class="w-6 h-6 text-white" />
                </div>
            </div>
            <div>
                <h3>重复文本高亮</h3>
                <el-switch v-model="isTextContrast" @change="handleComparePatent" />
                <div></div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.el-tabs--border-card {
    border: 0;
    border-top: 1px solid #e4e7ed;
}

:deep() .el-tabs__content {
    overflow: auto;
}

:deep(em) {
    font-style: normal;
    font-family: var(--Font-Family-Inter, PingFang SC);
    color: #6D3DCC;
    font-weight: 700;
    line-height: var(--Line-Height-22, 22px);
}
</style>
