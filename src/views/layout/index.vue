<script setup>
import { onMounted } from 'vue'
import useCommonStore from '@/stores/common'
import { listCustomerSearchSettings } from '@/api/search'
import Header from './Header.vue'

const commonStore = useCommonStore()

const getSystemInitData = async () => {
  try {
    const apis = [
      listCustomerSearchSettings({ limit: 10000 }),
    ]
    const [fieldRes] = await Promise.all(apis)
    commonStore.setFieldsMap(fieldRes.Data || [])

    commonStore.setLayoutLoading(false)
    console.log('init app')
  } catch (err) {
    console.log('init app error: ', err)
  }
}

onMounted(() => {
  // 获取数据
  getSystemInitData()
})
</script>

<template>
  <div class="w-full h-full flex flex-col overflow-hidden">
    <Header />

    <!-- content -->
    <div class="w-full flex-grow overflow-hidden">
      <router-view v-if="!commonStore.layoutLoading"></router-view>
    </div>
  </div>
</template>
