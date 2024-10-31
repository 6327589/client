<script setup>
import { classnames } from '@/utils'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import SearchIcon from '@/assets/icons/search.svg'

const route = useRoute()
const router = useRouter()

const menuList = [
  { id: 1, name: '普通检索', pageName: 'Search_General' },
  { id: 2, name: '语义检索', pageName: 'Search_Semantic' },
  { id: 3, name: '检索帮助', pageName: 'Search_Help' },
]

</script>

<template>
  <div class="w-full h-full flex">
    <div class="w-[200px] h-full flex-none bg-white border-r border-light">
      <div class="w-full h-12 px-5 flex items-center justify-between text-[var(--el-color-primary)]">
        <div class="flex items-center gap-1">
          <SearchIcon />
          <span>专利检索</span>
        </div>
        <!-- <el-icon><ArrowDown /></el-icon> -->
      </div>
      <router-link v-for="item in menuList" :key="item.id"
        :to="{name: item.pageName}"
        :class="classnames('w-full h-11 pl-10 flex items-center cursor-pointer',
          'hover:text-[var(--el-color-primary)]',
          route.name === item.pageName ? 'text-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)] border-r-[4px] border-[var(--el-color-primary)]' : ''
        )"
      >
        {{ item.name }}
      </router-link>
    </div>
    <div class="flex-grow h-full overflow-hidden">
      <router-view></router-view>
    </div>
  </div>
</template>
