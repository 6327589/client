<script setup>
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Field from './Field.vue'
import Number from './Number.vue'
import Grammar from './Grammar.vue'

</script>

<template>
  <div class="flex-grow max-h-full w-full px-6 pb-6 flex flex-col overflow-hidden">
    <h1 class="flex-none text-[36px] font-semibold text-black text-center mt-10">检索帮助</h1>
    <el-tabs type="border-card" class="flex-grow flex mt-4 mx-auto w-full max-w-[800px] overflow-hidden">
      <el-tab-pane label="可搜索字段">
        <Field />
      </el-tab-pane>
      <el-tab-pane label="搜索语法">
        <Grammar />
      </el-tab-pane>
      <el-tab-pane label="号码格式">
        <Number />
      </el-tab-pane>
    </el-tabs>

  </div>
</template>
<style scoped lang="scss">
:deep(.el-tabs__header) {
  flex: none
}

:deep(.el-tab-pane) {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  overflow: hidden;
}

:deep(.el-tabs__content) {
  padding: 0;
  display: flex;
  flex-grow: 1;
}
</style>
