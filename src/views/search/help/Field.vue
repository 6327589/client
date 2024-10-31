<script setup>

import { ref, onMounted, computed } from 'vue'
import { listCustomerSearchSettings } from '@/api/search'
import { filter } from '@/utils'
const containerRef = ref(null)
const searchList = ref([])

const textList = computed(() => {
  return searchList.value.filter(item => item.type === '文本')
})

const numberList = computed(() => {
  return searchList.value.filter(item => item.type === '号码')
})

const dateList = computed(() => {
  return searchList.value.filter(item => item.type === '日期')
})

const addrList = computed(() => {
  return searchList.value.filter(item => item.type === '地址')
})

const totalList = ref([
  {
    label: '文本',
    value: 'text',
    list: textList,
  },
  {
    label: '号码',
    value: 'number',
    list: numberList,
  },
  {
    label: '日期',
    value: 'date',
    list: dateList,
  },
  {
    label: '地址',
    value: 'addr',
    list: addrList,
  },
])
const handleClick = (e) => {
  e.preventDefault()
}

onMounted(() => {
  getListData()
})

const getListData = async () => {
  const res = await listCustomerSearchSettings({ limit: 10000 })
  let list = res.Data || []
  console.log(list)
  list = list.map(x => {
    return {
      id: x.id,
      abbreviation: x.abbreviation.toUpperCase(),
      name_en: x.name_en,
      name_zh: x.name_zh,
      type: filter('searchFieldType', x.type),
      weight: x.weight,
      updatedAt: x.updated_at,
    }
  })
  searchList.value = list
  loading.value = false
}
const loading = ref(true)
</script>

<template>
  <div class="flex-grow w-full flex overflow-hidden" v-loading="loading">
    <div class="flex-none w-40 mt-5">
      <el-anchor :container="containerRef" direction="vertical" type="underline" :offset="30" @click="handleClick">
        <el-anchor-link href="#text" title="文本" />
        <el-anchor-link href="#number" title="号码" />
        <el-anchor-link href="#date" title="日期" />
        <el-anchor-link href="#addr" title="地址" />
      </el-anchor>
    </div>
    <div ref="containerRef" class="flex-grow mx-4 scroll-content overflow-auto">
      <div v-for="item in totalList" :key="item.value" :id="item.value">
        <h2 class="mt-5 mb-2 text-[#256b07]">{{ item.label }}</h2>
        <el-table :data="item.list" stripe style="width: 100%">
          <el-table-column prop="abbreviation" label="缩略词" min-width="60" />
          <el-table-column prop="name_en" label="英文名" min-width="110" />
          <el-table-column prop="name_zh" label="中文名" min-width="80" />
          <el-table-column prop="type" label="类型" min-width="50" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-anchor) {
  height: 100%;

  .el-anchor__link {
    text-align: center;
    font-size: .875rem;
    color: #303133;
    line-height: 2.375rem;
  }

  .is-active {
    color: var(--el-anchor-active-color);
  }

  &.el-anchor--vertical.el-anchor--underline {
    &::before {
      left: 9.6875rem;
      width: .1875rem;
      height: 100%;
    }

    .el-anchor__marker {
      width: .1875rem;
      height: 2.375rem;
    }
  }

  &.el-anchor--vertical {
    .el-anchor__list {
      padding-left: 0;
    }

    .el-anchor__marker {
      left: 9.6875rem;
    }
  }
}

.scroll-content::-webkit-scrollbar {
  width: 0;
}

:deep(.el-table th.el-table__cell) {
  background-color: #fafafa;
}
</style>
