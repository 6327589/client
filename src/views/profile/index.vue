<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { classnames, getImgUrl } from '@/utils'
import UserIcon from '@/assets/icons/user.svg'
import RecordIcon from '@/assets/icons/record.svg'
import NoticeIcon from '@/assets/icons/notice.svg'
import useBaseLocalStore from '@/stores/local'

const route = useRoute()
const router = useRouter()
const baseLocalStore = useBaseLocalStore()

const menuList = [
  { id: 1, name: '我的信息', icon: UserIcon, pageName: 'Profile_Info' },
  { id: 2, name: '购买记录', icon: RecordIcon, pageName: 'Profile_Record' },
  { id: 3, name: '消息通知', icon: NoticeIcon, pageName: 'Profile_Notice' },
]

</script>

<template>
  <div class="w-full h-full flex">
    <!-- menu -->
    <div class="w-[200px] h-full flex-none bg-white border-r border-light">
      <div class="w-full p-6 flex flex-col items-center justify-center">
        <img class="w-20 h-20 rounded-full" :src="baseLocalStore.userInfo.avatar" alt="">
        <h1 class="mt-2 font-medium">{{baseLocalStore.userInfo.name}}</h1>
      </div>
      <div class="w-full">
        <router-link v-for="item in menuList" :key="item.id"
          :to="{name: item.pageName}"
          :class="classnames('w-full h-11 pl-5 flex items-center gap-1 cursor-pointer',
            'hover:text-[var(--el-color-primary)]',
            route.name === item.pageName ? 'text-[var(--el-color-primary)] bg-[var(--el-color-primary-light-9)] border-r-[4px] border-[var(--el-color-primary)]' : ''
          )"
        >
          <component :is="item.icon" class="" />
          {{ item.name }}
        </router-link>
      </div>
    </div>
    <div class="flex-grow">
      <router-view></router-view>
    </div>
  </div>
</template>
