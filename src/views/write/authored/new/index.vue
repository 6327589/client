<script setup>
import { classnames, getImgUrl } from '@/utils'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const list = [
  { id: 1, comingSoon: true, img: getImgUrl('analysis_novelty.png'), type: 'button', title: '上传交底书(准备中)' },
  { id: 2, comingSoon: false, img: getImgUrl('analysis_creativity.png'), type: 'page', routeName: 'Write_Authored_Write', title: '自行撰写' },
  { id: 3, comingSoon: false, img: getImgUrl('analysis_disclosure.png'), type: 'button', title: '下载交底书模板' },
]
const handleClickItem = (item) => {
  if (item.type === 'page') {
    router.push({ name: item.routeName })
  } else {
    if (item.id === 3) {
      ElMessage.warning('正在准备中...')
    }
  }
}

</script>

<template>
  <div class="w-full h-full p-5">
    <div class="container mx-auto flex flex-wrap items-center gap-4" :style="{
      '--w': 'calc(50% - 8px)',
    }">
      <div v-for="item in list" :key="item.id"
        class="w-[var(--w)] bg-white rounded-lg border border-light p-6 flex flex-col items-center gap-4 hover:[box-shadow:0px_8px_20px_#00000014,_0px_12px_32px_4px_#0000000a]"
        @click="handleClickItem(item)"
      >
        <div v-if="item.id === 1" class="w-10 h-10 rounded-full bg-[#8C91DD] text-white flex items-center justify-center">
          <el-icon size="20"><Upload/></el-icon>
        </div>
        <div v-if="item.id === 2" class="w-10 h-10 rounded-full bg-[#69D0CA] text-white flex items-center justify-center">
          <el-icon size="20"><EditPen/></el-icon>
        </div>
        <div v-if="item.id === 3" class="w-10 h-10 rounded-full bg-[#9ED979] text-white flex items-center justify-center">
          <el-icon size="20"><Download/></el-icon>
        </div>

        <div :class="classnames('flex items-center text-lg font-medium',
          item.comingSoon ? 'opacity-70' : '',
        )">
          <span>{{ item.title }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
