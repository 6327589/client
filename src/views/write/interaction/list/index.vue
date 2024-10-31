<script setup>
import { onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { confirmExecHandle } from '@/utils'
import EditDialog from './EditDialog.vue'
import { listPatentDraft, deletePatentDraft } from '@/api/write'
import { ElMessage } from 'element-plus'

const projectList = ref([])
const pageLoading = ref(false)

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

const handleDelete = (row) => {
  confirmExecHandle('删除项目', '确认删除该项目吗？删除后，将无法继续访问该项目。', () => {
    return deletePatentDraft({ id: row.id }).then(res => {
      ElMessage.success('删除成功')
      getListData()
    })
  })
}

const getListData = async () => {
  try {
    pageLoading.value = true
    // const res = await listPatentDraft({ listAll: true })
    const res = await listPatentDraft({ limit: 10000 })
    let list = res.Data || []
    list = list.map(x => {
      return {
        id: x.id,
        name: x.title,
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

onMounted(() => {
  getListData()
})

</script>

<template>
  <div class="w-full h-full flex flex-col p-6">
    <div class="w-full max-h-full px-5 pb-5 bg-white flex flex-col">
      <div class="flex-none py-3 flex items-center justify-between">
        <span class="font-semibold text-black text-xl">项目列表</span>
        <el-button type="primary" @click="handleCreate">新建项目</el-button>
      </div>
      <div class="flex-grow flex flex-col overflow-hidden">
        <el-table class="flex-grow" :data="projectList" v-loading="pageLoading">
          <el-table-column prop="name" label="项目名称" min-width="300">
            <template v-slot="scope">
              <router-link :to="{name: 'Write_Interaction_Claims', params: {id: scope.row.id}}" class="text-[var(--el-color-primary)] hover:underline cursor-pointer">
                {{ scope.row.name }}
              </router-link>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="技术领域" min-width="300">
            <template v-slot="">
              人工智能、图像处理
            </template>
          </el-table-column>
          <el-table-column prop="createdAt" label="创建时间" min-width="120" />
          <el-table-column prop="updatedAt" label="修改时间" min-width="120" />
          <el-table-column prop="" label="操作" width="180">
            <template v-slot="scope">
              <div class="flex items-center gap-2">
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
