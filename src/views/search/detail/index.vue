<script setup>
import { onMounted, ref } from 'vue'
import { classnames } from '@/utils'
import { useRoute, useRouter } from 'vue-router'
import { getPatentInfoHighLight, getPatentDetailImage, exportPatentFile } from '@/api/search'
import BaseInfo from './BaseInfo.vue'
import Claims from './Claims.vue'
import Description from './Description.vue'
import Images from './Images.vue'
import Pdf from './Pdf.vue'
import useCommonStore from '@/stores/common'
import { ElMessage } from 'element-plus'
import useBaseLocalStore from '@/stores/local'
import useSearchLocalStore from '@/stores/search'

const searchLocalStore = useSearchLocalStore()
const baseLocalStore = useBaseLocalStore()
const commonStore = useCommonStore()
const route = useRoute()
const router = useRouter()

const isOpenMenu = ref(true)
const currentMenu = ref(1)
const menuList = [
  { id: 1, name: '基本信息' },
  { id: 2, name: '权利要求' },
  { id: 3, name: '说明书' },
  { id: 4, name: '附图' },
  { id: 5, name: 'PDF' },
]

const id = route.params.id
const detail = ref({
  images: [],
})

const loading = ref(true)
const initData = async () => {
  const body = {
    document_number: id,
    query: searchLocalStore.searchQuery,
  }
  try {
    const [res, imageRes] = await Promise.all([
      getPatentInfoHighLight(body),
      getPatentDetailImage({ document_number: id }),
    ])
    let images = imageRes.images_base64 || []
    images = images.filter(x => !!x).map(x => `data:image/png;base64,${x}`)

    detail.value = {
      title: res.title,
      application_number: res.application_number, // 申请号
      application_date: res.application_date, // 申请日
      document_number: res.document_number, // 公开公告号
      document_date: res.document_date, // 公开公告日
      applicant: res.applicant.join('，'), // 申请人, array
      first_applicant: res.first_applicant, // 第一申请人
      inventor: res.inventor.join('，'), // 发明人, array
      ipc: res.ipc ? res.ipc.join('，') : '', // ipc分类号, array
      abstract: res.abstract, // 摘要
      description: res.description, // 说明书
      claims: res.claims, // 权利要求
      images,
    }
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  initData()
})

// 加入对比列
const handleAddContrastQueue = () => {
  if (!baseLocalStore.token) router.push({ name: 'Login' })
  else {
    const queue = commonStore.contrastQueue
    const length = commonStore.contrastQueue.length
    const id = route.params.id
    const item = queue.find(x => x.type === 'database' && x.docId === id)
    if (item) {
      ElMessage({
        type: 'warning',
        message: '该专利已加入对比列',
      })
    } else if (queue.length >= 2) {
      ElMessage({
        type: 'warning',
        message: '对比列已满',
      })
    } else {
      queue.push({ type: 'database', docId: route.params.id, id: length })
      commonStore.setContrastQueue(queue)
      ElMessage({
        type: 'success',
        message: '已加入对比列',
      })
    }
  }
}

const isExporting = ref(false)
const handleExport = async () => {
  if (!baseLocalStore.token) router.push({ name: 'Login' })
  isExporting.value = true
  const body = { document_number: [route.params.id], file_type: 'pdf' }
  const fileName = '专利.pdf'
  const res = await exportPatentFile(body, fileName)
  isExporting.value = false
  console.log(res)
}

const viewType = ref('one')
</script>

<template>
  <div class="w-full h-full flex">
    <!-- left -->
    <div :class="classnames('flex-none h-full bg-white border-r border-r-light transition-all duration-300',
      'flex flex-col',
      isOpenMenu ? 'w-[200px]' : 'w-0',
    )">
      <div class="flex-none w-full h-15 flex items-center border-b border-b-light relative">
        <span :class="classnames('font-medium ml-4 text-xl truncate overflow-hidden',
        )">专利查看</span>

        <div :class="classnames('absolute -bottom-4 w-8 h-8 border rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform duration-300',
          isOpenMenu ? '-right-4' : '-right-8 rotate-180',
        )" @click="isOpenMenu = !isOpenMenu">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </div>
      </div>

      <div class="w-full overflow-hidden">
        <div v-for="item in menuList" :key="item.id" :class="classnames('w-full h-11 pl-10 flex items-center cursor-pointer truncate',
          'hover:text-[var(--el-color-primary)]',
          currentMenu === item.id ? 'text-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)] border-r-[4px] border-[var(--el-color-primary)]' : ''
        )" @click="currentMenu = item.id">
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- content -->
    <div class="flex-grow h-full px-6 py-4 flex flex-col">
      <div class="flex-none w-full flex items-center justify-between">
        <div>
          <div class="flex">
            <div class="w-20 text-[var(--el-text-color-regular)]">专利号：</div>
            <div class="font-medium">{{ id }}</div>
          </div>
          <div class="flex">
            <div class="w-20 text-[var(--el-text-color-regular)]">专利名称：</div>
            <div class="font-medium" v-html="detail.title"></div>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <el-button class="" @click="handleExport" :loading="isExporting">
            <el-icon class="w-4 h-4 mr-1">
              <Upload class="text-base" />
            </el-icon>
            <span>导出</span>
          </el-button>
          <el-button class="!ml-0" type="primary" @click="handleAddContrastQueue">
            <el-icon class="w-4 h-4 mr-1">
              <CirclePlus class="text-base" />
            </el-icon>
            <span>加入对比列</span>
          </el-button>
          <el-radio-group v-model="viewType">
            <el-radio-button label="单视图" value="one" />
            <el-radio-button label="双视图" value="two" />
          </el-radio-group>
        </div>
      </div>

      <div class="flex-grow mt-4 w-full gap-7.5 flex flex-col rounded border border-light bg-white overflow-auto"
        v-loading="loading"
      >
        <BaseInfo :detail="detail" v-if="currentMenu === 1" />
        <Claims :detail="detail" v-if="currentMenu === 2" />
        <Description :detail="detail" v-if="currentMenu === 3" />
        <Images :list="detail.images" v-if="currentMenu === 4" />
        <Pdf :detail="detail" v-if="currentMenu === 5" />
      </div>
    </div>

  </div>
</template>

<style lang="scss" scoped>
:deep(em) {
  font-style: normal;
  // color: #6d3dcc;
  background: #ffbaba;
}
</style>
