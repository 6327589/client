<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import RangeDialog from '@/views/search/components/RangeDialog.vue'
import { useRouter, useRoute } from 'vue-router'
import { classnames } from '@/utils'
import { ElMessage } from 'element-plus'
import useSearchLocalStore from '@/stores/search'
import ListTextIcon from '@/assets/icons/list_text.svg'
import ListImageIcon from '@/assets/icons/list_image.svg'

const route = useRoute()
const router = useRouter()
const searchLocalStore = useSearchLocalStore()

const searchValue = ref('')
const handleSearch = () => {
  if (searchValue.value === '') {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  if (searchValue.value.length < 10) {
    ElMessage.warning('搜索关键词长度不能小于10')
    return
  }

  searchLocalStore.setSemanticSearchValue(searchValue.value)
}

const rangeDialogVisible = ref(false)
const handleOpenRangeDialog = () => {
  rangeDialogVisible.value = true
}

onMounted(() => {
  searchValue.value = searchLocalStore.semanticSearchValue
})

</script>

<template>
  <div class="flex-grow rounded bg-white flex items-center h-8">
    <el-button class="h-full rounded-l rounded-r-none" type="primary" @click="handleOpenRangeDialog">
      <el-icon class="w-3 h-3"><Coin class="text-xs" /></el-icon>
      <span class="ml-1 mr-2 font-medium">数据库</span>
      <el-icon class="w-3 h-3"><ArrowDown class="text-xs" /></el-icon>
    </el-button>
    <el-input class="flex-grow h-full px-4 search-input border-y" v-model="searchValue"
      placeholder="输入搜索关键词"
      @keyup.enter="handleSearch"
    />
    <div class="h-full px-4 flex items-center justify-center border-y border-r rounded-r cursor-pointer
      bg-[var(--el-color-primary)] text-white
    " @click="handleSearch">
      <el-icon class="w-3.5 h-3.5"><Search class="text-sm" /></el-icon>
    </div>
  </div>

  <range-dialog v-model:visible="rangeDialogVisible"></range-dialog>
</template>

<style lang="scss" scoped>
.search-input{
  :deep(.el-input__wrapper){
    box-shadow: none;
  }
}
</style>
