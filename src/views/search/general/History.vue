<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { listSearchHistory, addSearchHistory, deleteSearchHistory } from '@/api/search'
import { Search } from '@element-plus/icons-vue'
import { confirmExecHandle } from '@/utils'
import { ElMessage } from 'element-plus'

const router = useRouter()

const allList = ref([])

const searchValue = ref('')
const getData = async () => {
  const res = await listSearchHistory({ limit: 50 })
  let list = res.items || []
  list = list.map((item) => {
    return {
      label: item.query,
      value: item.ID,
    }
  })
  allList.value = list
  list.value = list
}

const list = computed(() => {
  if (searchValue.value === '') {
    return allList.value
  } else {
    return allList.value.filter((item) => {
      return item.label.includes(searchValue.value)
    })
  }
})

onMounted(() => {
  getData()
})
const handleSearch = async (item) => {
  addSearchHistory({ query: item.label }).finally(() => {
    router.push({
      name: 'Search_General_List',
      query: {
        search_value: encodeURIComponent(item.label),
      },
    })
  })
}

const handleConfirmClear = async () => {
  confirmExecHandle('提示', '确认清空历史记录吗？', () => {
    return deleteSearchHistory({ delete_all: true }).then(res => {
      ElMessage.success('清空成功')
      allList.value = []
    })
  })
}
const handleDelete = async (item) => {
  await deleteSearchHistory({
    search_history_id: [item.value],
  })
  allList.value = allList.value.filter((i) => i.value !== item.value)
}

</script>

<template>
  <div class="flex items-center gap-3">
    <h2 class="text-base font-medium">历史记录</h2>
    <div class="flex-1">
      <el-input class="w-[240px]" v-model="searchValue" placeholder="搜索历史记录" :suffix-icon="Search"/>
    </div>

    <el-tooltip
      content="清空历史记录"
      placement="bottom"
    >
      <el-button type="primary" link @click="handleConfirmClear">
        <el-icon size="16"><Delete/></el-icon>
      </el-button>
    </el-tooltip>
  </div>
  <div class="mt-6 w-full min-h-[500px]">
    <div class="w-full flex flex-wrap gap-4">
      <div v-for="(item, index) in list" :key="index"
        class="px-4 py-1 rounded bg-[var(--el-fill-color-light)] text-[var(--el-text-color-regular)] cursor-pointer flex items-center gap-2"
        @click="handleSearch(item)"
      >
        <span>{{item.label}}</span>
        <el-icon class="hover:bg-[var(--el-text-color-regular)] hover:text-white rounded-full"
          @click.stop="handleDelete(item)"
        ><Close /></el-icon>
      </div>
    </div>
  </div>
</template>
