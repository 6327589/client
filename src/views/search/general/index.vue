<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import History from './History.vue'
import Help from './Help.vue'
import QuestionCircle from '@/assets/icons/question-circle.svg'
import SearchInput from './SearchInput.vue'

</script>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="flex-grow overflow-hidden">
      <div class="w-full max-h-full px-6 pb-6 flex flex-col overflow-hidden">
        <h1 class="flex-none text-[36px] font-semibold text-black text-center mt-10">普通检索</h1>

        <div class="flex-grow mt-4 mx-auto w-full max-w-[800px] flex flex-col overflow-hidden">

          <!-- input -->
          <SearchInput  />

          <div class="flex-grow w-full mt-4 border border-light rounded-lg bg-white pl-6 pb-6 pt-4 pr-4 overflow-auto">
            <!-- history -->
            <History />

          </div>

          <div class="w-full mt-4 flex justify-end px-4">
            <router-link :to="{ name: 'Search_Help' }"
              class="flex items-center gap-2 text-[var(--el-color-primary)] cursor-pointer">
              <span class="font-medium">检索帮助</span>
              <el-icon>
                <QuestionCircle />
              </el-icon>
            </router-link>
          </div>

        </div>
      </div>
    </div>
    <p class="flex-none text-center pb-3 text-[var(--el-text-color-secondary)]">
      目前普通检索已接入中国区所有专利数据，约5500万条
      </p>
  </div>

</template>

<style lang="scss" scoped>
.search-input {
  :deep(.el-input__wrapper) {
    box-shadow: none;
  }
}
</style>
