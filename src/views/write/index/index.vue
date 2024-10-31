<script setup>
import { getImgUrl } from '@/utils'
import { useRouter } from 'vue-router'
const router = useRouter()
const list = [
  { id: 1, comingSoon: false, img: getImgUrl('write_interaction.png'), routeName: 'Write_Interaction', title: '多轮交互撰写' },
  { id: 2, comingSoon: false, img: getImgUrl('write_authored.png'), routeName: 'Write_Authored', title: '一键式撰写' },
  { id: 3, comingSoon: true, img: getImgUrl('write_disclosure.png'), routeName: 'Write_Disclosure', title: '交底书辅助撰写' },
]
const handleGoPage = (routeName) => {
  router.push({ name: routeName })
}

</script>

<template>
  <div class="w-full h-full p-5">
    <div class="container mx-auto flex items-center justify-center gap-4">
      <div v-for="item in list" :key="item.id"
        class="flex-1 max-w-[450px] bg-white rounded border border-light p-6 flex flex-col items-center gap-4 hover:[box-shadow:0px_8px_20px_#00000014,_0px_12px_32px_4px_#0000000a]">
        <img :src="item.img" class="w-20 h-20" :alt="item.title" />
        <h1 class="text-lg font-medium">{{ item.title }}</h1>
        <h2 class="text-[var(--el-text-color-secondary)] text-center px-10">{{ item.intro }}</h2>
        <el-button v-if="item.comingSoon" plain disabled>
          正在准备...
        </el-button>
        <el-button v-else plain type="primary" class="!h-8" link @click="handleGoPage(item.routeName)">
          <span class="mr-1">进入</span>
          <el-icon>
            <ArrowRightBold />
          </el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>
