<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import useBaseLocalStore from '@/stores/local'
import { updateRouteQuery } from 'utils/listQuery'

const props = defineProps({
  tableName: String,
  getDataApi: Function,
})

const baseLocalStore = useBaseLocalStore()

const pageData = reactive({
  size: baseLocalStore.pageSize,
  current: 1,
  total: 0,
})
watch(() => props.total, val => {
  pageData.realTotal = val
})

const handleSizeChange = (val) => {
  pageData.size = val
  pageData.current = 1
  getData()
  // baseLocalStore.setPageSize(val)
}
const handleCurrentChange = () => {
  getData()
  // updateRouteQuery(props.tableName, {
  //   offset,
  //   limit: pageData.size,
  //   current: pageData.current,
  //   total: pageData.realTotal,
  // })
}

const tableList = ref([])
const tableLoading = ref(false)
const maxTotal = 20000
const realTotal = ref(0)
const getData = async () => {
  try {
    const query = {
      limit: pageData.size,
      offset: (pageData.current - 1) * pageData.size,
    }
    tableLoading.value = true
    const { items, total } = await props.getDataApi(query)
    pageData.total = total < maxTotal ? total : maxTotal
    realTotal.value = total
    tableList.value = items
    tableLoading.value = false
  } catch (error) {
    tableLoading.value = false
  }
}

const refreshTable = () => {
  pageData.current = 1
  getData()
}

onMounted(() => {
  getData()
})

const initSearch = () => {
  const pageOption = baseLocalStore.pageOptions[props.tableName]
  pageData.size = Number(pageOption.limit)
  pageData.current = Number(pageOption.current)
  pageData.realTotal = Number(pageOption.total)
}

defineExpose({
  refreshTable,
})

</script>

<template>
  <div class="flex-grow flex flex-col overflow-hidden">
    <!-- table -->
    <slot name="table" v-bind:tableList="tableList" v-bind:tableLoading="tableLoading"></slot>

    <!-- table-footer -->
    <div class="flex-none mt-2.5 flex items-center justify-end">
      <el-pagination background layout="slot, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]"
        :total="pageData.total" v-model:page-size="pageData.size" v-model:current-page="pageData.current"
        @size-change="handleSizeChange" @current-change="handleCurrentChange">
        <template #default>
          <span class="text-[#606266]">共 {{ realTotal }} 条</span>
        </template>
      </el-pagination>
    </div>
  </div>
</template>
