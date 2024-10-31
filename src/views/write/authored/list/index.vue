<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { format, confirmExecHandle } from '@/utils'
import EditDialog from './EditDialog.vue'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { listPatentDraft, deletePatentDraft } from '@/api/write'

const projectList = ref([])
const pageLoading = ref(false)

const typeList = [
  { label: '一键式撰写', value: '1' },
  { label: '交底书辅助撰写', value: '2' },
  { label: '多轮交互撰写', value: '3' },
]

const searchForm = ref({
  title: '',
  time: null,
  type: '',
})

const editDialogData = ref({
  visible: false,
  data: {},
})

const handleCreate = () => {
  editDialogData.value.data = {
    name: '',
  }
  editDialogData.value.visible = true
}
const handleRename = (row) => {
  editDialogData.value.data = {
    id: row.id,
    name: row.name,
  }
  editDialogData.value.visible = true
}

const getListData = async () => {
  try {
    pageLoading.value = true
    const res = await listPatentDraft({ limit: 10000 })
    let list = res.Data || []
    list = list.map(x => {
      return {
        id: x.id,
        name: x.title,
        type: '一键式撰写',
        createdAt: x.created_at,
        updatedAt: x.updated_at,
      }
    })

    projectList.value = list
    pageLoading.value = false
  } catch (_) {
    pageLoading.value = false
  }
}

const handleDelete = (row) => {
  confirmExecHandle('删除项目', '确认删除该项目吗？删除后，将无法继续访问该项目。', () => {
    return deletePatentDraft({ id: row.id }).then(res => {
      ElMessage.success('删除成功')
      getListData()
    })
  })
}
const selectedTable = ref([])
const handleSelectionChange = (values) => {
  selectedTable.value = values
}
const handleBatchDeleteConfirm = () => {
  confirmExecHandle(
    '批量删除',
    `确认删除选中的${selectedTable.value.length}个项目吗？`,
    () => {
      const apis = selectedTable.value.map((x) =>
        deletePatentDraft({ id: x.id }),
      )
      return Promise.all(apis).then((_) => {
        ElMessage.success('批量删除成功')
        getListData()
      }).catch((_) => { })
    },
  )
}

const handleReset = () => {
  searchForm.value = {
    title: '',
    time: null,
    type: '',
  }
  getListData()
}

onMounted(() => {
  getListData()
})

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setDate(start.getDate() - 7)
      return [start, end]
    },
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 1)
      return [start, end]
    },
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setMonth(start.getMonth() - 3)
      return [start, end]
    },
  },
]

</script>

<template>
  <div class="w-full h-full flex flex-col p-6">
    <div class="w-full max-h-full p-5 bg-white flex flex-col">
      <div class="flex-none flex gap-5">
        <div class="flex gap-5">
          <el-input class="w-[360px]" v-model="searchForm.title" placeholder="项目名称" clearable
            @clear="getListData"
          >
            <template #append>
              <el-button :icon="Search"  @click="getListData" />
            </template>
          </el-input>
          <el-date-picker
            :teleported="false"
            v-model="searchForm.time"
            type="datetimerange"
            :shortcuts="shortcuts"
            range-separator="-"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            @change="getListData"
          />
          <el-select :teleported="false" class="w-[150px]" v-model="searchForm.type"
            placeholder="类型"
            @change="getListData"
          >
            <el-option label="全部类型" value=""></el-option>
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="handleReset">重置</el-button>
        </div>
      </div>
      <div class="flex-none py-3 flex items-center">
        <el-button type="primary" @click="handleCreate">
          <el-icon class="mr-2"><Plus/></el-icon>
          新建项目
        </el-button>
        <el-button @click="handleBatchDeleteConfirm" :disabled="!selectedTable.length">
          <el-icon class="mr-2"><Delete/></el-icon>
          批量删除 <span v-if="selectedTable.length">({{ selectedTable.length }})</span>
        </el-button>
      </div>
      <div class="flex-grow flex flex-col overflow-hidden">
        <el-table class="flex-grow" :data="projectList" v-loading="pageLoading"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" header-align="center" width="48"></el-table-column>
          <el-table-column prop="id" label="ID" width="60" />
          <el-table-column prop="name" label="项目名称" min-width="300">
            <template v-slot="scope">
              <router-link :to="{name: 'Write_Authored_New', params: {id: scope.row.id}}" class="text-[var(--el-color-primary)] hover:underline cursor-pointer">
                {{ scope.row.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型" width="140">
            <template v-slot="scope">
              <el-tag type="primary">{{ scope.row.type }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" width="160" />
          <el-table-column prop="updatedAt" label="修改时间" width="160" />
          <el-table-column prop="" label="操作" width="180">
            <template v-slot="scope">
              <div class="flex items-center gap-2">
                <el-button type="primary" link>导出</el-button>
                <el-button type="primary" link @click="handleRename(scope.row)">重命名</el-button>
                <el-button type="primary" link @click="handleDelete(scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>

  <edit-dialog v-model:visible="editDialogData.visible" :data="editDialogData.data" @edit-success="getListData" />
</template>
