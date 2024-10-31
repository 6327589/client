<script setup>
import { useRouter, useRoute, RouterLink } from 'vue-router'
import Logo from '@/assets/icons/logo.svg'
import { classnames } from '@/utils'
import UserIcon from '@/assets/icons/user.svg'
import LogoutIcon from '@/assets/icons/logout.svg'
import { ElMessageBox } from 'element-plus'
import useBaseLocalStore from '@/stores/local'
import Assistant from '@/views/write/interaction/components/Assistant.vue'
import { ref, watch } from 'vue'

const route = useRoute()
const router = useRouter()

const baseLocalStore = useBaseLocalStore()
const menuList = [
  { id: 1, name: '首页', pageName: 'Home' },
  { id: 2, name: '专利检索', pageName: 'Search' },
  { id: 3, name: '专利分析', pageName: 'Analysis' },
  { id: 4, name: '辅助撰写', pageName: 'Write' },
  { id: 5, name: '关于我们', pageName: 'About' },
]

const goProfilePage = () => {
  router.push({ name: 'Profile_Info' })
}
const logout = () => {
  ElMessageBox.confirm('确认退出吗?', '提示', {
    type: 'warning',
    confirmButtonText: '确定',
    cancelButtonText: '取消',
  }).then(_ => {
    baseLocalStore.setLogout()
  }).catch(_ => {
    console.log('err', _)
  })
}

const breadcrumb = ref(null)
watch(() => route.name, () => {
  const arr = []
  let hasBreadcrumb = false
  breadcrumb.value = route.matched.forEach((item, index) => {
    if (item.meta.title) {
      arr.push({
        id: index,
        label: item.meta.title,
        pageName: item.name || item.meta.name,
      })
    }
    if (item.meta.hasBreadcrumb) {
      hasBreadcrumb = true
    }
  })

  if (hasBreadcrumb) {
    breadcrumb.value = arr
  } else {
    breadcrumb.value = null
  }
}, { immediate: true })

const handleChangeMenu = (command) => {
  if (command === 'profile') {
    goProfilePage()
  } else if (command === 'logout') {
    logout()
  }
}

</script>

<template>
  <header class="w-full flex-none px-4 h-12 bg-white border-b border-light flex items-center">
    <router-link :to="{ name: 'Home' }" class="flex items-center gap-1">
      <Logo class="w-6 h-6" />
      <span class="text-base font-semibold">蒙图未来专利助手</span>
    </router-link>

    <div class="flex-grow flex items-center h-full pl-14">
      <!-- <router-link :to="{ name: item.pageName }" v-for="item in breadcrumb" :key="item.id" :class="classnames('flex items-center h-full px-5 cursor-pointer font-medium border-b-2',
        route.name.startsWith(item.pageName) ? 'text-[var(--el-color-primary)] border-[var(--el-color-primary)]' : 'border-transparent',
      )">
        {{ item.name }}
      </router-link> -->
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="item in breadcrumb" :key="item.id"
          :to="{ name: item.pageName }"
        >{{ item.label }}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="flex-grow flex h-full pl-14">
      <router-link :to="{ name: item.pageName }" v-for="item in menuList" :key="item.id" :class="classnames('flex items-center h-full px-5 cursor-pointer font-medium border-b-2',
        route.name.startsWith(item.pageName) ? 'text-[var(--el-color-primary)] border-[var(--el-color-primary)]' : 'border-transparent',
      )">
        {{ item.name }}
      </router-link>
    </div>

    <Assistant v-if="route.name.startsWith('Write') && route.name !== 'Write'" />

    <div class="flex gap-2" v-if="!baseLocalStore.token">
      <router-link :to="{ name: 'Login' }">
        <el-button>登录</el-button>
      </router-link>
      <router-link :to="{ name: 'Register' }">
        <el-button plain type="primary">免费注册</el-button>
      </router-link>
    </div>
    <el-dropdown v-else class="h-full px-2.5 flex items-center justify-center text-[#606266] cursor-pointer outline-none
      hover:bg-[#f6f6f6]
    " @command="handleChangeMenu">
      <div class="h-full flex items-center">
        <img class="w-6 h-6 rounded-full mr-2" :src="baseLocalStore.userInfo.avatar" alt="" />
        <span class="mr-1">{{ baseLocalStore.userInfo.name }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="profile">
            <UserIcon class="w-4 h-4 mr-1" />
            个人中心
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <LogoutIcon class="w-4 h-4 mr-1" />
            退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </header>
</template>
