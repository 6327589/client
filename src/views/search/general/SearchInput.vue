<script setup>
import { ElMessage } from 'element-plus'
import { nextTick, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import RangeDialog from '@/views/search/components/RangeDialog.vue'
import useSearchLocalStore from '@/stores/search'
import { parseExpression } from '@/utils/expression'
import { classnames } from '@/utils'
import useCommonStore from '@/stores/common'
import { addSearchHistory } from '@/api/search'

const router = useRouter()
const searchLocalStore = useSearchLocalStore()
const commonStore = useCommonStore()

const checkStatus = ref(true)
const checkString = () => {
  checkStatus.value = !!parseExpression(searchValue.value, commonStore.fieldsMap)
}

const inputRef = ref(null)
const searchValue = ref('')
const handleSearch = async () => {
  if (searchValue.value === '') {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  if (!checkStatus.value) {
    ElMessage.warning('请检查查询语句格式')
    return
  }
  addSearchHistory({ query: searchValue.value }).finally(() => {
    router.push({
      name: 'Search_General_List',
      query: {
        search_value: encodeURIComponent(searchValue.value),
      },
    })
  })
}

const list = [
  {
    id: 1,
    title: '文本',
    list: [
      { id: 11, abbreviation: 'TIT', key: 'title', label: '标题' },
      { id: 12, abbreviation: 'SUM', key: 'summary', label: '摘要' },
      { id: 13, abbreviation: 'DES', key: 'description', label: '说明书' },
      { id: 14, abbreviation: 'CLA', key: 'claims', label: '权利要求' },
    ],
  },
  {
    id: 2,
    title: '公司&人',
    list: [
      { id: 21, abbreviation: 'CURA', key: 'current_assignee', label: '当前专利权人' },
      { id: 22, abbreviation: 'FAPP', key: 'first_applicant', label: '第一申请人' },
      { id: 23, abbreviation: 'ASSI', key: 'assignee', label: '专利权人' },
      { id: 24, abbreviation: 'APP', key: 'applicant', label: '申请人' },
    ],
  },
  {
    id: 3,
    title: '分类号',
    list: [
      { id: 31, abbreviation: 'IPC', key: 'ipc', label: 'IPC分类号' },
      { id: 32, abbreviation: 'MAINIPC', key: 'mainipc', label: '主分类号' },
    ],
  },
  {
    id: 4,
    title: '号码&日期',
    list: [
      { id: 41, abbreviation: 'APN', key: 'application_number', label: '申请号' },
      { id: 42, abbreviation: 'DOCN', key: 'document_number', label: '公开（公告）号' },
      { id: 43, abbreviation: 'APPD', key: 'application_date', label: '申请日' },
      { id: 44, abbreviation: 'DOCD', key: 'document_date', label: '公开（公告）日' },
    ],
  },
]

watch(() => searchLocalStore.clickItem, (val) => {
  if (val) {
    searchLocalStore.setClickItem(null)
    isClickItem = true
    const interText = `${val.abbreviation}:()`
    const input = inputRef.value.$el.querySelector('input')

    const currentValue = searchValue.value

    // 获取当前光标位置
    const start = input.selectionStart
    const end = input.selectionEnd

    // 在光标位置插入新文本
    const str = currentValue.slice(0, start) + interText + currentValue.slice(end)
    searchValue.value = str
    input.focus()
    nextTick(() => {
    // 将光标移动到插入文本之后
      const position = Math.max(0, start + interText.length - 1)
      input.setSelectionRange(position, position)
      checkString()
      setTimeout(() => {
        isClickItem = false
      }, 500)
    })
  }
})

const rangeDialogVisible = ref(false)
const handleOpenRangeDialog = () => {
  rangeDialogVisible.value = true
}

let isClickItem = false
const moreVisible = ref(false)
const handleClickItem = (val) => {
  isClickItem = true
  const interText = ` ${val} `
  const input = inputRef.value.$el.querySelector('input')
  const currentValue = searchValue.value

  // 获取当前光标位置
  const start = input.selectionStart
  const end = input.selectionEnd

  // 在光标位置插入新文本
  const str = currentValue.slice(0, start) + interText + currentValue.slice(end)
  searchValue.value = str
  input.focus()
  nextTick(() => {
    // 将光标移动到插入文本之后
    const position = Math.max(0, start + interText.length)
    input.setSelectionRange(position, position)
    checkString()
    setTimeout(() => {
      isClickItem = false
    }, 500)
  })
}
const handleFocus = () => {
  moreVisible.value = true
}
const handleBlur = () => {
  setTimeout(() => {
    if (!isClickItem) {
      moreVisible.value = false
    }
  }, 200)
}

const handleClickItem2 = (val) => {
  isClickItem = true
  const interText = `${val.abbreviation}:()`
  const input = inputRef.value.$el.querySelector('input')

  const currentValue = searchValue.value

  // 获取当前光标位置
  const start = input.selectionStart
  const end = input.selectionEnd

  // 在光标位置插入新文本
  const str = currentValue.slice(0, start) + interText + currentValue.slice(end)
  searchValue.value = str
  input.focus()
  nextTick(() => {
    // 将光标移动到插入文本之后
    const position = Math.max(0, start + interText.length - 1)
    input.setSelectionRange(position, position)
    checkString()
    setTimeout(() => {
      isClickItem = false
    }, 500)
  })
}

</script>

<template>
  <div class="flex-none w-full border border-light rounded bg-white p-1 flex gap-4 items-center">
    <el-button class="h-12" type="primary" @click="handleOpenRangeDialog">
      <el-icon class="w-4 h-4"><Coin class="text-base" /></el-icon>
      <span class="ml-1 mr-2">数据库</span>
      <el-icon class="w-3 h-3"><ArrowDown class="text-xs" /></el-icon>
    </el-button>
    <div class="flex-grow h-12 relative">
      <el-input ref="inputRef" class="w-full h-full border-none search-input" v-model="searchValue"
        :style="!checkStatus ? '--el-input-text-color: #ff4d4f' : ''"
        @input="checkString"
        placeholder="输入搜索关键词"
        @focus="handleFocus"
        @blur="handleBlur"
        @keyup.enter="handleSearch"
      />

      <el-card :class="classnames('absolute left-0 top-7.5 bg-white rounded w-full z-[10000] overflow-auto',
        moreVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      )">
        <h1 class="text-[var(--el-text-color-secondary)] mb-2">逻辑词</h1>
        <div class="flex w-[300px] gap-6">
          <p class="py-1 px-2 cursor-pointer rounded hover:bg-[var(--el-fill-color)]"
            @click.stop="handleClickItem('OR')">OR</p>
          <p class="py-1 px-2 cursor-pointer rounded hover:bg-[var(--el-fill-color)]"
            @click.stop="handleClickItem('AND')">AND</p>
          <p class="py-1 px-2 cursor-pointer rounded hover:bg-[var(--el-fill-color)]"
            @click.stop="handleClickItem('NOT')">NOT</p>
        </div>

        <div class="mt-6 w-full flex flex-wrap gap-y-6 gap-x-12.5">
          <div v-for="item in list" :key="item.id" class="w-[var(--w)]" style="--w:calc(50% - 25px)">
            <h2 class="text-base font-medium">{{ item.title }}</h2>
            <div class="mt-2 w-full flex flex-col">
              <div v-for="li in item.list" :key="li.id" class="h-8 px-1 rounded flex items-center justify-between cursor-pointer
                hover:bg-[var(--el-fill-color)]
              " @click="handleClickItem2(li)">
                <div
                  class="h-6 flex items-center px-3 text-xs font-medium bg-[var(--el-fill-color-light)] text-[var(--el-color-primary)]">
                  {{ li.abbreviation }}
                </div>
                <div class="text-[var(--el-text-color-placeholder)]">
                  {{ li.label }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <el-button class="h-12" type="primary" @click="handleSearch">
      <el-icon class="w-4 h-4"><Search class="text-base" /></el-icon>
    </el-button>
  </div>

  <range-dialog v-model:visible="rangeDialogVisible"></range-dialog>
</template>
