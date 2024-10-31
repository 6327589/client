<script setup>
import { classnames, consoleJson, filter } from '@/utils'
import { onMounted, ref, toRaw, watch, computed } from 'vue'
import { basicSearch, exportPatentFile, getPatentImages } from '@/api/search'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import Input from './Input.vue'
import Input1 from './Input1.vue'
import DuibiIcon from '@/assets/icons/duibi.svg'
import useSearchLocalStore from '@/stores/search'
import Checkbox from './Checkbox.vue'
import DateRange from './DateRange.vue'
import { parseExpression } from '@/utils/expression'
import useCommonStore from '@/stores/common'
import useBaseLocalStore from '@/stores/local'
import { ElMessage } from 'element-plus'
import ListImageIcon from '@/assets/icons/list_image.svg'
import ListTextIcon from '@/assets/icons/list_text.svg'

const baseLocalStore = useBaseLocalStore()
const route = useRoute()
const router = useRouter()
const searchLocalStore = useSearchLocalStore()
const commonStore = useCommonStore()

const isOpenMenu = ref(true)

const menuList = ref([
  // {
  //   id: 1,
  //   title: '国家地区',
  //   isOpen: true,
  //   key: 'country_code',
  //   value: searchLocalStore.searchFrom.country_code || [],
  //   type: 'checkbox',
  //   items: [
  //     { label: '🇨🇳中国（CN）', value: 'CN' },
  //   ],
  // },
  {
    id: 2,
    title: '公开类型',
    isOpen: true,
    key: 'type',
    value: searchLocalStore.searchFrom.type || [],
    type: 'checkbox',
    items: [
      { label: '发明', value: '发明' }, // 发明公开 + 发明授权
      { label: '实用新型', value: '实用新型' },
      { label: '外观设计', value: '外观设计' },
    ],
  },
  {
    id: 3,
    title: '专利有效性',
    isOpen: true,
    key: 'legal_status',
    value: searchLocalStore.searchFrom.legal_status,
    type: 'checkbox',
    disabled: !!searchLocalStore.searchFrom.current_status.length,
    items: [
      { label: '有效', value: '有效' }, // 有效专利
      { label: '失效', value: '失效' }, // 失效专利 + 无效专利
      { label: '待定', value: '待定' }, // 公开 + 实质审查
    ],
  },
  {
    id: 4,
    title: '状态',
    isOpen: true,
    key: 'current_status',
    value: searchLocalStore.searchFrom.current_status,
    type: 'checkbox',
    disabled: !!searchLocalStore.searchFrom.legal_status.length,
    items: [
      { label: '驳回', value: '驳回' },
      { label: '撤回', value: '撤回' },
      { label: '公开', value: '公开' },
      { label: '权利终止', value: '权利终止' },
      { label: '实质审查', value: '实质审查' },
      { label: '授权', value: '授权' },
    ],
  },
  {
    id: 5,
    title: '申请日',
    isOpen: true,
    key: 'application_date',
    value: searchLocalStore.searchFrom.application_date || null,
    type: 'dateRange',
  },
  {
    id: 6,
    title: '公开（公告）日',
    isOpen: true,
    key: 'document_date',
    value: searchLocalStore.searchFrom.document_date || null,
    type: 'dateRange',
  },
  // {
  //   id: 6,
  //   title: '发明（设计）人',
  //   isOpen: true,
  //   isLoading: false,
  //   value: [],
  //   items: [
  //     { label: '发明申请', value: 1 },
  //     { label: '授权发明', value: 2 },
  //     { label: '实用新型', value: 3 },
  //     { label: '外观设计', value: 4 },
  //   ],
  // },
  // {
  //   id: 7,
  //   title: '当前权利人',
  //   isOpen: true,
  //   isLoading: false,
  //   value: [],
  //   items: [
  //     { label: '发明申请', value: 1 },
  //     { label: '授权发明', value: 2 },
  //     { label: '实用新型', value: 3 },
  //     { label: '外观设计', value: 4 },
  //   ],
  // },
])

const handleChangeItem = (key, value) => {
  if (key === 'legal_status') {
    const item = menuList.value.find(x => x.key === 'current_status')
    item.disabled = !!value.length
    item.value = []
  } else if (key === 'current_status') {
    const item = menuList.value.find(x => x.key === 'legal_status')
    item.disabled = !!value.length
    item.value = []
  }
  searchLocalStore.setSearchFromItem(key, value)
}
const handleOpenMenu = async (item) => {
  if (!item.isOpen) {
    item.isOpen = true
  } else {
    item.isOpen = false
  }
}

const getFilter = (data) => {
  const arr = []
  for (const key in data) {
    let val = data[key]
    if (val && val.length) {
      if (['type', 'legal_status', 'current_status'].includes(key)) {
        if (key === 'type') {
          const vals = []
          for (const x of val) {
            const v = filter('searchFieldDataTypeValue', x)
            vals.push(...v)
          }
          val = vals
        } else if (key === 'legal_status') {
          const vals = []
          for (const x of val) {
            const v = filter('searchFieldDataLegalStatusValue', x)
            vals.push(...v)
          }
          val = vals
        }
        arr.push({
          op: 'term',
          key,
          value: val,
        })
      } else if (['application_date', 'document_date'].includes(key)) {
        arr.push({
          op: 'range',
          key,
          value: val,
        })
      }
    }
  }
  return arr
}

const getQuery = () => {
  const searchValue = decodeURIComponent(route.query.search_value)
  const filterArr = getFilter(toRaw(searchLocalStore.searchFrom))
  console.log('filterArr', filterArr)

  let query = parseExpression(searchValue, commonStore.fieldsMap)
  consoleJson(query)
  // console.log(JSON.stringify(query, null, 2))

  // let query = {
  //   op: 'multi_match',
  //   value: [
  //     searchValue,
  //   ],
  // }
  // if (query.exprs.length === 0) {
  //   query = {
  //     op: 'multi_match',
  //     value: [
  //       searchValue,
  //     ],
  //   }
  // } else if (query.exprs.length === 1) {
  //   query = query.exprs[0]
  //   if (query.exprs.length === 0) {
  //     query = {
  //       op: 'multi_match',
  //       value: [
  //         searchValue,
  //       ],
  //     }
  //   }
  // }
  if (filterArr.length) {
    query = {
      op: 'AND',
      exprs: [
        query,
        ...filterArr,
      ],
    }
  }

  return query
}

const updateMenuValue = () => {
  menuList.value.forEach((item) => {
    if (item.key === 'country_code') {
      item.value = searchLocalStore.searchFrom.country_code
    }
    if (item.key === 'type') {
      item.value = searchLocalStore.searchFrom.type
    }
    if (item.key === 'legal_status') {
      item.value = searchLocalStore.searchFrom.legal_status
    }
    if (item.key === 'current_status') {
      item.value = searchLocalStore.searchFrom.current_status
    }
    if (item.key === 'application_date') {
      item.value = searchLocalStore.searchFrom.application_date
    }
    if (item.key === 'document_date') {
      item.value = searchLocalStore.searchFrom.document_date
    }
    return item
  })
}

watch(() => searchLocalStore.searchFrom, () => {
  updateMenuValue()
  tableRef.value.refreshTable()
}, { deep: true })

watch(() => route.query.search_value, () => {
  tableRef.value.refreshTable()
})

const showType = ref('list')

const tableRef = ref()
const getListData = async (pageQuery) => {
  const searchQuery = getQuery()
  searchLocalStore.setSearchQuery(searchQuery)
  const body = {
    limit: pageQuery.limit,
    offset: pageQuery.offset,
    query: searchQuery,
    order_field: sortData.value.key,
    order_type: sortData.value.sort,
  }
  const res = await basicSearch(body)
  let list = res.data || []
  let images = []
  if (showType.value === 'image' && list.length) {
    images = await getPatentImages({ document_numbers: list.map(x => x.document_number) })
    images = images.images_base64
  }
  list = list.map((x, i) => {
    return {
      imgUrl: images[i] ? `data:image;base64,${images[i]}` : '',
      document_number: x.document_number || '', // 公开号
      title: x.title, // 标题
      type: x.type, // 类型
      typeLabel: filter('searchFieldDataType', x.type),
      typeTagType: filter('searchFieldDataTypeTagType', x.type),
      legal_status: x.legal_status, // 专利有效性
      legalStatusLabel: filter('searchFieldDataLegalStatus', x.legal_status),
      legalStatusTagType: filter('searchFieldDataLegalStatusTagType', x.legal_status),
      current_status: x.current_status, // 当前状态
      currentStatusTagType: filter('searchFieldDataCurrentStatusTagType', x.current_status),
      applicant: x.applicant.join(','), // array 申请人
      current_assignee: x.current_assignee.join(','), // 当前专利权人
      inventor: x.inventor.join(','), // 发明人
      technical_field: x.technical_field, // 技术领域
      application_date: x.application_date, // 申请日
      application_number: x.application_number, // 申请号
      document_date: x.document_date, // 公开公告日
      ipc: x.ipc ? x.ipc.join(',') : '', // ipc分类号
      abstract: x.abstract,
    }
  })

  return {
    items: list,
    total: res.total,
  }
}

const handleShowTypeChange = () => {
  if (showType.value === 'image') {
    tableRef.value.refreshTable()
  }
}

const handleGoPage = (routeName) => {
  if (!baseLocalStore.token) router.push({ name: 'Login' })
  else {
    if (tableSelectedData.value.length > 0) {
      const list = commonStore.contrastQueue
      const document_number = tableSelectedData.value.map(x => x.document_number)
      document_number.forEach(x => list.push({ id: list.length, type: 'database', docId: x }))
      commonStore.setContrastQueue(list)
    }
    router.push({ name: routeName })
  }
}

const tableSelectedData = ref([])
const isExporting = ref(false)
const handleExport = async () => {
  if (!baseLocalStore.token) router.push({ name: 'Login' })
  const document_number = tableSelectedData.value.map(x => x.document_number) || []
  if (document_number.length !== 0) {
    isExporting.value = true
    const body = { document_number, file_type: 'zip' }
    const fileName = '专利.zip'
    await exportPatentFile(body, fileName)
    isExporting.value = false
  } else {
    ElMessage({
      type: 'warning',
      message: '请选择至少一个专利',
    })
  }
}

const handleSelectionChange = (val) => {
  tableSelectedData.value = val
}

const isConstrastDisabled = computed(() => {
  const queueLength = commonStore.contrastQueue.length
  if (queueLength === 0) return tableSelectedData.value.length !== 2
  else if (queueLength === 1) return tableSelectedData.value.length !== 1
  else if (queueLength === 2) return tableSelectedData.value.length !== 0
})

const sortValue = ref('score-desc')
const sortData = ref({
  key: 'score',
  sort: 'desc',
})
const sortList = [
  { label: '相关度', key: 'score-desc', sort: 'desc' },
  { label: '申请日', key: 'application_date-desc', sort: 'desc' },
  { label: '申请日', key: 'application_date-asc', sort: 'asc' },
  { label: '公开（公告）日', key: 'document_date-desc', sort: 'desc' },
  { label: '公开（公告）日', key: 'document_date-asc', sort: 'asc' },
]
const handleSortChange = () => {
  const [key, sort] = sortValue.value.split('-')
  sortData.value = { key, sort }
  tableRef.value.refreshTable()
}

</script>

<template>
  <div class="w-full h-full flex">
    <!-- left -->
    <div :class="classnames('flex-none h-full bg-white border-r border-r-light transition-all duration-300',
      'flex flex-col',
      isOpenMenu ? 'w-[270px]' : 'w-0',
    )">
      <div class="flex-none w-full h-15 flex items-center border-b border-b-light relative">
        <span :class="classnames('font-medium ml-4 text-xl truncate overflow-hidden',
        )">高级检索设置</span>

        <div :class="classnames('absolute -bottom-4 w-8 h-8 border rounded-full bg-white flex items-center justify-center cursor-pointer transition-transform duration-300',
          isOpenMenu ? '-right-4' : '-right-8 rotate-180',
        )" @click="isOpenMenu = !isOpenMenu">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </div>
      </div>

      <div class="w-full flex-grow overflow-auto">
        <div v-for="(item, i) in menuList" :key="item.id" :class="classnames('w-full py-1 pl-4 pr-3',
          i !== menuList.length - 1 ? 'border-b border-b-light' : '',
        )">
          <div class="w-full py-2 flex items-center justify-between cursor-pointer overflow-hidden"
            @click="handleOpenMenu(item)">
            <span class="font-medium">{{ item.title }}</span>
            <el-icon :class="classnames('transition-transform duration-300',
              item.isOpen ? 'rotate-180' : 'rotate-0'
            )">
              <ArrowDown />
            </el-icon>
          </div>
          <div :class="classnames('w-full flex flex-col gap-2 relative overflow-hidden',
            item.isOpen ? 'h-auto pb-2' : 'h-0 pb-0',
          )" v-loading="item.isLoading">

            <checkbox v-if="item.type === 'checkbox'" v-model="item.value" :disabled="item.disabled" :items="item.items"
              @on-change="handleChangeItem(item.key, $event)" />
            <date-range v-if="item.type === 'dateRange'" v-model="item.value"
              @on-change="handleChangeItem(item.key, $event)" />

          </div>

        </div>

      </div>

    </div>

    <!-- content -->
    <div class="flex-grow h-full flex flex-col overflow-hidden">
      <div class="flex-grow overflow-hidden">
        <div class="w-full max-h-full px-6 py-4 flex flex-col">
          <div class="flex-none w-full flex items-center gap-4">
            <Input />

            <el-button class="" @click="handleExport" :loading="isExporting">
              <el-icon class="w-4 h-4 mr-1">
                <Upload class="text-base" />
              </el-icon>
              <span>导出</span>
            </el-button>

            <el-button type="primary" class="!ml-0 relative" @click="handleGoPage('Analysis_Contrast')"
              :disabled="isConstrastDisabled">
              <el-tag class="absolute -top-2 -right-2 rounded-xl" type="danger" effect="dark">
                {{ commonStore.contrastQueue.length }}
              </el-tag>
              <DuibiIcon class="w-4 h-4 mr-1" />
              <span>对比查看</span>
            </el-button>
          </div>

          <div class="pt-2 w-full flex items-center gap-2.5">
            <el-select class="w-[160px]"
              v-model="sortValue" placeholder="排序"
              @change="handleSortChange"
            >
              <template #label="{ label, value }">
                <div class="w-full h-full flex items-center justify-center">
                  <el-icon>
                    <Bottom v-if="value.endsWith('desc')" />
                    <Top v-else />
                  </el-icon>
                  <span class="ml-1">{{ label }}</span>
                </div>
              </template>
              <el-option
                v-for="item in sortList"
                :key="item.key"
                :label="item.label"
                :value="item.key"
              >
                <el-icon>
                  <Bottom v-if="item.sort === 'desc'" />
                  <Top v-else />
                </el-icon>
                <span class="ml-2">{{ item.label }}</span>
              </el-option>
            </el-select>

            <el-radio-group v-model="showType" @change="handleShowTypeChange">
              <el-radio-button value="list">
                <ListTextIcon class="w-3.5 h-3.5" />
              </el-radio-button>
              <el-radio-button value="image">
                <ListImageIcon class="w-3.5 h-3.5" />
              </el-radio-button>
            </el-radio-group>
          </div>

          <div class="flex-grow w-full mt-2 bg-white p-4 overflow-hidden flex">
            <r-table ref="tableRef" tableName="Search_General_List" :getDataApi="getListData">
              <template #table="{ tableList, tableLoading }">
                <!-- 列表模式 -->
                <el-table v-if="showType === 'list'" class="flex-grow" v-loading="tableLoading"
                  :data="tableList" @selection-change="handleSelectionChange">
                  <el-table-column type="selection" align="center" header-align="center" width="48"></el-table-column>
                  <el-table-column prop="document_number" label="公开(公告)号" width="140">
                    <template v-slot="scope">
                      <router-link :to="{ name: 'Search_Detail', params: { id: scope.row.document_number } }"
                        class="text-[var(--el-color-primary)] hover:underline cursor-pointer">
                        {{ scope.row.document_number }}
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="title" label="专利名称" show-overflow-tooltip min-width="100">
                    <template v-slot="scope">
                      <router-link :to="{ name: 'Search_Detail', params: { id: scope.row.document_number } }"
                        class="hover:underline cursor-pointer">
                        <div class="truncate" v-html="scope.row.title"></div>
                      </router-link>
                    </template>
                  </el-table-column>
                  <el-table-column prop="typeLabel" label="公开类型" width="120">
                    <template v-slot="scope">
                      <el-tag v-if="scope.row.type !== null" :type="scope.row.typeTagType">{{
                        scope.row.typeLabel }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="legalStatusLabel" label="专利有效性" width="120">
                    <template v-slot="scope">
                      <el-tag v-if="scope.row.legalStatusLabel !== null" :type="scope.row.legalStatusTagType">{{
                        scope.row.legalStatusLabel }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="current_status" label="状态" width="120">
                    <template v-slot="scope">
                      <el-tag v-if="scope.row.current_status !== null" :type="scope.row.currentStatusTagType">{{
                        scope.row.current_status }}</el-tag>
                    </template>
                  </el-table-column>
                  <el-table-column prop="applicant" label="当前申请(专利权)人" show-overflow-tooltip min-width="100" />
                  <!-- <el-table-column prop="technical_field" label="应用领域分类" show-overflow-tooltip min-width="100" /> -->
                  <el-table-column prop="application_date" label="申请日" width="120" />
                </el-table>

                <!-- 图文模式 -->
                <div v-else class="flex-grow overflow-hidden" v-loading="tableLoading">
                  <div class="w-full h-full flex flex-col gap-4 overflow-auto">
                    <div v-for="data in tableList" :key="data.document_number" class="flex gap-6 p-2 border-b-2">
                      <div class="flex-none w-40">
                        <el-image class="w-full h-40 border-2"
                          :src="data.imgUrl"
                          :zoom-rate="1.2"
                          :max-scale="7"
                          :min-scale="0.2"
                          :preview-src-list="[data.imgUrl]"
                          fit="cover"
                        />
                        <!-- <img :src="data.imgUrl" alt="" class="w-full border-2"> -->
                      </div>
                      <div class="flex- grow flex flex-col">
                        <div>
                          <router-link :to="{ name: 'Search_Detail', params: { id: data.document_number } }"
                            class="text-[var(--el-color-primary)] hover:underline cursor-pointer">
                            公开公告号：{{ data.document_number }}
                          </router-link>
                        </div><br>
                        <div>
                          <router-link :to="{ name: 'Search_Detail', params: { id: data.document_number } }"
                            class="hover:underline cursor-pointer">
                            专利名称：
                            <span class="truncate" v-html="data.title"></span>
                          </router-link>
                        </div>
                        <div class="flex gap-4">
                          <span>申请日：{{ data.application_date }}</span>
                          <span>公开（公告）日：{{ data.document_date }}</span>
                        </div>
                        <div>申请号：{{ data.application_number }}</div>
                        <div>申请人：{{ data.applicant }}</div>
                        <div>发明人：{{ data.inventor }}</div>
                        <div>当前专利权人：{{ data.current_assignee }}</div>
                        <div>IPC分类号：{{ data.ipc }}</div><br>
                        <div class="line-clamp-3">摘要：{{ data.abstract }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </template>
            </r-table>
          </div>
        </div>
        <div v-if="!baseLocalStore.token" class="mt-20 flex flex-col justify-center items-center gap-4">
          <p class="font-bold">当前处于未登录状态</p>
          <el-button type="primary" class=" rounded-xl"
            @click="() => router.push({ name: 'Login' })">请点此登录，查看更多专利信息</el-button>
        </div>
      </div>
      <p class="flex-none text-center pb-3 text-[var(--el-text-color-secondary)]">
        目前普通检索已接入中国区所有专利数据，约5500万条
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-checkbox__label) {
  flex-grow: 1;
  display: flex;
}

:deep(.el-loading-spinner) {
  --el-loading-spinner-size: 28px;
}

:deep(em) {
  font-style: normal;
  // color: #6d3dcc;
  background: #ffbaba;
}
</style>
