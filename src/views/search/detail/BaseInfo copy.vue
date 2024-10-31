<script setup>
import { ref } from 'vue'

const contentList = ref([])
</script>

<template>
  <div v-for="item in contentList" :key="item.id"
    class="w-full"
  >
    <div class="flex items-center justify-between py-1">
      <h1 class="text-xl font-medium">{{ item.title }}</h1>
      <div class="w-7.5 h-7.5 border rounded-full flex items-center justify-center cursor-pointer"
        @click="handleClickItemOpen(item)"
      >
        <el-icon :class="classnames('transition-transform duration-300',
          item.isOpen ? 'rotate-180' : '',
        )"><ArrowDown /></el-icon>
      </div>

    </div>
    <div :class="classnames('mt-2 w-full rounded p-4 bg-[var(--el-fill-color-light)] text-[var(--el-text-color-regular)]',
      item.isOpen ? 'block' : 'hidden',
    )">
      {{ item.content }}
    </div>
  </div>
</template>
