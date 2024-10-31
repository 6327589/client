<script setup>
import { ref } from 'vue'
import useSearchLocalStore from '@/stores/search'

const searchLocalStore = useSearchLocalStore()

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

const handleClickItem = (item) => {
  searchLocalStore.setClickItem(item)
}

</script>

<template>
  <div class="mt-6 w-full flex flex-wrap gap-y-6 gap-x-12.5">
    <div v-for="item in list" :key="item.id" class="w-[var(--w)]" style="--w:calc(50% - 25px)">
      <h2 class="text-base font-medium">{{ item.title }}</h2>
      <div class="mt-2 w-full flex flex-col">
        <div v-for="li in item.list" :key="li.id" class="h-8 px-1 rounded flex items-center justify-between cursor-pointer
          hover:bg-[var(--el-fill-color)]
        " @click="handleClickItem(li)">
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
</template>
