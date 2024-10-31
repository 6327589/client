<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import RangeDialog from '@/views/search/components/RangeDialog.vue'
import useSearchLocalStore from '@/stores/search'

const searchLocalStore = useSearchLocalStore()
const router = useRouter()

const searchValue = ref('')
const handleSearch = async () => {
  if (searchValue.value === '') {
    ElMessage.warning('请输入搜索关键词')
    return
  }
  if (searchValue.value.length < 10) {
    ElMessage.warning('搜索关键词长度不能小于10')
    return
  }

  searchLocalStore.setSemanticSearchValue(searchValue.value)
  router.push({
    name: 'Search_Semantic_List',
  })
}

const rangeDialogVisible = ref(false)
const handleOpenRangeDialog = () => {
  rangeDialogVisible.value = true
}

</script>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <div class="flex-grow overflow-hidden">
      <div class="w-full max-h-full px-6 pb-6 flex flex-col overflow-hidden">
        <h1 class="flex-none text-[36px] font-semibold text-black text-center mt-10">语义检索</h1>

        <div class="flex-grow mt-4 mx-auto w-full max-w-[800px] overflow-auto">
          <div class="w-full
            border border-light rounded bg-white px-3 pt-2 pb-5
          ">
            <el-input type="textarea" class="search-input" v-model="searchValue" :autosize="{ minRows: 10 }"
              placeholder="建议输入一段技术描述文本（如权利要求，建议200字以上），以获得更加相关的结果。" />
          </div>

          <div class="mt-4 w-full flex items-center justify-between">
            <el-button class="" @click="handleOpenRangeDialog">
              <el-icon class="w-4 h-4">
                <Coin class="text-base" />
              </el-icon>
              <span class="ml-1 mr-2">数据库</span>
              <el-icon class="w-3 h-3">
                <ArrowDown class="text-xs" />
              </el-icon>
            </el-button>
            <el-button type="primary" class="flex items-center" @click="handleSearch">
              <el-icon>
                <Search />
              </el-icon>
              <span class="ml-1">搜索专利</span>
            </el-button>
          </div>
        </div>

      </div>
    </div>
    <p class="flex-none text-center pb-3 text-[var(--el-text-color-secondary)]">
      目前普通检索已接入中国区所有专利数据，约5500万条
    </p>
  </div>

  <range-dialog v-model:visible="rangeDialogVisible"></range-dialog>

</template>

<style lang="scss" scoped>
.search-input {
  :deep(.el-textarea__inner) {
    box-shadow: none;
  }
}
</style>
