<script setup>
import { useRoute } from 'vue-router'
import Logo from '@/assets/icons/logo.svg'
import { classnames } from '@/utils'
import useBaseLocalStore from '@/stores/local'

const baseLocalStore = useBaseLocalStore()
const route = useRoute()

const menuList = [
  { id: 1, name: '首页', pageName: 'Home' },
  { id: 2, name: '专利检索', pageName: 'Search_General' },
  { id: 3, name: '专利分析', pageName: 'Analysis' },
  { id: 4, name: '辅助撰写', pageName: 'Write' },
  { id: 5, name: '关于我们', pageName: 'About' },
]

</script>

<template>
  <div class="w-full flex-none h-12 bg-white border-b">
    <div class="container mx-auto h-full flex items-center px-4">
      <router-link :to="{name: 'Home'}" class="flex items-center gap-1">
        <Logo class="w-6 h-6" />
        <span class="text-base font-semibold ">蒙图未来专利助手</span>
      </router-link>
      <div class="flex-grow flex h-full pl-14">
        <router-link :to="{name: item.pageName}" v-for="item in menuList" :key="item.id"
          :class="classnames('flex items-center h-full px-5 cursor-pointer font-medium border-b-2',
            route.name === item.pageName ? 'text-[var(--el-color-primary)] border-[var(--el-color-primary)]' : 'border-transparent',
          )"
        >
          {{ item.name }}
        </router-link>
      </div>
      <div class="flex gap-2" v-if="!baseLocalStore.token">
        <router-link :to="{name: 'Login'}">
          <el-button>登录</el-button>
        </router-link>
        <router-link :to="{name: 'Register'}">
          <el-button plain type="primary">免费注册</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
