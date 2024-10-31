<script setup>
import { classnames } from '@/utils'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import useWriteLocalStore from '@/stores/write'
import { onMounted, ref, watch } from 'vue'
import useCommonStore from '@/stores/common'
const commonStore = useCommonStore()
const writeLocalStore = useWriteLocalStore()
const route = useRoute()
const router = useRouter()

const menuList = [
  { id: 1, name: '权利要求辅助撰写', pageName: 'Write_Interaction_Claims' },
  { id: 2, name: '说明书辅助撰写', pageName: 'Write_Interaction_Description' },
  { id: 3, name: '说明书摘要辅助撰写', pageName: 'Write_Interaction_Summary' },
  { id: 4, name: '全文检查/润色', pageName: 'Write_Interaction_Polish' },
]

const pageLoading = ref(true)
const init = async () => {
  await writeLocalStore.syncMenu()
  pageLoading.value = false
}

onMounted(() => {
  init()
})
const currentMenuRef = ref(null)
const setCurrentRef = (el, item) => {
  if (route.name === item.pageName) { currentMenuRef.value = el }
}
watch(() => currentMenuRef.value, (element) => {
  const message = `请点击这里进入${route.meta.title}`
  commonStore.setTourList(element, 0, message)
})
</script>

<template>
  <div class="w-full h-full flex">

    <div class="w-[200px] h-full flex-none bg-white border-r border-light">
      <router-link v-for="item in menuList" :key="item.id" :to="{ name: item.pageName }" :class="classnames('w-full h-11 pl-10 flex items-center cursor-pointer',
        'hover:text-[var(--el-color-primary)]',
        route.name === item.pageName ? 'text-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)] border-r-[4px] border-[var(--el-color-primary)]' : ''

      )" :ref="(el) => setCurrentRef(el, item)">
        {{ item.name }}
      </router-link>
    </div>
    <div class="flex-grow h-full p-4">
      <router-view v-if="!pageLoading"></router-view>
      <div v-else class="w-full h-full relative" v-loading="pageLoading"></div>
    </div>
  </div>
</template>
