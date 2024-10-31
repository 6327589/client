<script setup>
import { onMounted, ref, computed, toRaw } from 'vue'
import { copy } from '@/utils'
import { useRoute } from 'vue-router'
import { listRecord, listPolish } from '@/api/write'
import Description from './Description.vue'
import Summary from './Summary.vue'
import Claim from './Claim.vue'
import useWriteLocalStore from '@/stores/write'
import Tooltip from '../components/Tooltip.vue'
import ExportDialog from './ExportDialog.vue'
import useCommonStore from '@/stores/common'

const commonStore = useCommonStore()
const writeLocalStore = useWriteLocalStore()
const route = useRoute()

const draftId = Number(route.params.id)

const fieldMap = computed(() => {
  return writeLocalStore.fieldMap
})

const pageLoading = ref(true)
const descriptionData = ref({
  status: 'show',
  isPolish: false,
  polishId: '',
  polishContent: '',
  polishLoading: '',
  polishEditValue: '',
  polishSaveLoading: false,
  items: [],
})
const abstractData = ref({
  status: 'show',
  isPolish: false,
  polishId: '',
  polishContent: '',
  polishLoading: '',
  polishEditValue: '',
  polishSaveLoading: false,
  items: [],
})
const claimData = ref({
  status: 'show',
  isPolish: false,
  polishId: '',
  polishContent: '',
  polishLoading: '',
  polishEditValue: '',
  polishSaveLoading: false,
  items: [],
})

function getRecord (list, polishObj) {
  if (!list.length) {
    return {
      status: 'show',
      items: [],
    }
  }

  const paragraphMap = {}
  let implementationCount = 0
  let lastImplementation = null

  // 首先按照paragraph分组
  list.forEach(item => {
    let paragraphName = item.paragraph
    if (paragraphName === '具体实施方式（必填）') {
      if (lastImplementation && lastImplementation.children.length < 2) {
        // 继续使用上一个实施例
        paragraphName = lastImplementation.paragraph
      } else {
        // 创建新的实施例
        implementationCount++
        paragraphName = `具体实施方式${implementationCount}（必填）`
      }
    }

    if (!paragraphMap[paragraphName]) {
      paragraphMap[paragraphName] = {
        paragraph: paragraphName,
        children: [],
      }
      if (paragraphName.startsWith('具体实施方式')) {
        lastImplementation = paragraphMap[paragraphName]
      }
    }

    if (item.name_zh) {
      paragraphMap[paragraphName].children.push({
        name_zh: item.name_zh,
        ID: item.ID,
        fieldId: item.field_id,
      })
    } else if (!paragraphName.startsWith('具体实施方式')) {
      // 只有非实施例的段落才直接添加ID
      paragraphMap[paragraphName].ID = item.ID
      paragraphMap[paragraphName].fieldId = item.field_id
    }
  })

  // 将map转换为数组
  let result = Object.values(paragraphMap)

  // 对每个paragraph的children进行排序，并处理没有children的项
  result = result.map((item, index) => {
    if (item.children && item.children.length > 0) {
      item.children = item.children.map((xx, ii) => {
        const fieldData = toRaw(fieldMap.value[xx.fieldId])
        const recordData = list.find(x => x.ID === xx.ID)
        return {
          pid: index,
          id: xx.ID,
          recordId: xx.ID,
          label: xx.name_zh,
          fieldId: xx.fieldId,
          content: recordData.content,
          min_word: fieldData.min_word,
          editValue: '',
          saveLoading: false,
          isEdit: false,
        }
      })
      return {
        index: (index + 1 + '').padStart(2, '0'),
        pid: index,
        id: index,
        status: 'show',
        saveLoading: false,
        label: item.paragraph,
        items: item.children,
      }
    } else {
      // 如果没有children，直接返回{ID, paragraph}
      const fieldData = toRaw(fieldMap.value[item.fieldId])
      const recordData = list.find(x => x.ID === item.ID)
      return {
        index: (index + 1 + '').padStart(2, '0'),
        pid: index,
        id: item.ID,
        recordId: item.ID,
        label: item.paragraph,
        fieldId: item.fieldId,
        status: 'show',
        content: recordData.content,
        min_word: fieldData.min_word,
        editValue: '',
        saveLoading: false,
      }
    }
  })
  console.log('result', result)
  return {
    status: 'show',
    isPolish: !!polishObj,
    polishId: polishObj?.id || '',
    polishContent: polishObj?.content || '',
    // isPolish: true,
    // polishContent: 'aaa',
    polishLoading: '',
    polishEditValue: '',
    polishSaveLoading: false,
    items: result,
  }
}

const getClaimDataList = (recordList) => {
  if (!recordList.length) {
    return []
  }

  return recordList.map((x, i) => {
    return {
      index: (i + 1 + '').padStart(2, '0'),
      recordId: x.ID,
      label: x.paragraph,
      content: x.content,
      editValue: '',
      status: 'show',
      saveLoading: false,
    }
  })
}
const getData = async () => {
  pageLoading.value = true
  const apis = [
    listRecord({ category: 'claim', draft_id: draftId }),
    listRecord({ category: 'description', draft_id: draftId }),
    listRecord({ category: 'abstract', draft_id: draftId }),
    listPolish({ draft_id: draftId }),
  ]
  const [claimRecord, descriptionRecord, abstractRecord, polishRes] = await Promise.all(apis)
  const polishList = polishRes.Data || []
  claimData.value = getClaimDataList(claimRecord.Data || [])

  const descriptionPolish = polishList.find(x => x.category === 'description')
  const abstractPolish = polishList.find(x => x.category === 'abstract')

  descriptionData.value = getRecord(descriptionRecord.Data || [], descriptionPolish)
  abstractData.value = getRecord(abstractRecord.Data || [], abstractPolish)
  pageLoading.value = false
}

onMounted(() => {
  getData()
})

const exportVisible = ref(false)
const handleExport = () => {
  exportVisible.value = true
}

</script>

<template>
  <div class="w-full h-full bg-[#ffffff99]" v-loading="pageLoading">
    <div class="h-full w-full px-5 max-w-[900px] mx-auto flex flex-col overflow-hidden">
      <div class="flex-none pt-6 pb-2 flex items-center justify-center gap-4">
        <h1 class="text-2xl font-medium text-center text-[var(--el-color-primary)]">检查/润色</h1>
        <Tooltip class="" content="使用检查/润色功能前，请确保所有模块已被认真填写，且内容不少于80字。" />
      </div>
      <div class="flex-grow p-6 border border-light rounded bg-white overflow-auto
      ">
        <Claim type="claim" :draftId="draftId" :initData="claimData" />
        <!-- <Description type="description" :draftId="draftId" :initData="descriptionData" /> -->
        <Description type="description" :draftId="draftId" :initData="descriptionData" />
        <Description type="abstract" :draftId="draftId" :initData="abstractData" />
      </div>
      <div class="flex-none flex items-center justify-end pt-4 pb-4">
        <el-button class="w-40" @click="handleExport"
          :ref="(el) => commonStore.setTourList(el, 2, '请点击“导出”将最终文本导出到本地')">导出</el-button>
        <el-button type="primary" class="w-40"
          :ref="(el) => commonStore.setTourList(el, 3, '请点击“新颖性分析”进入专利分析页面')">新颖性分析</el-button>
      </div>
    </div>

    <export-dialog v-model:visible="exportVisible" :draftId="draftId"></export-dialog>
  </div>
</template>
