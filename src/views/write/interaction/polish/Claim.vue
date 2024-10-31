<script setup>
import { ref, watch } from 'vue'
import { classnames, copy } from '@/utils'
import { updateRecord } from '@/api/write'
import Markdown from '../components/Markdown.vue'

const props = defineProps({
  type: String,
  draftId: Number,
  initData: Object,
})

const data = ref([])

watch(() => props.initData, (val) => {
  data.value = copy(props.initData)
}, { immediate: true })

const handleOpenEdit = (item) => {
  item.editValue = item.content
  item.saveLoading = false
  item.status = 'edit'
}
const handleSaveEdit = async (item) => {
  const body = {
    draft_id: props.draftId,
    new_content: item.editValue,
    record_id: item.recordId,
  }
  item.saveLoading = true
  await updateRecord(body)
  item.content = item.editValue
  item.editValue = ''
  item.saveLoading = false
  item.status = 'show'
}
const handleCancelEdit = (item) => {
  item.editValue = ''
  item.status = 'show'
}

</script>

<template>
  <div class="mt-5 w-full">

    <h1 class="pt-6 pb-5 text-lg font-medium text-center ">
      <div class="w-full relative">
        权利要求
      </div>
    </h1>
    <div v-if="data.length" class="w-full">
      <!-- 撰写模式 -->
      <div :class="classnames('leading-[22px]')">
        <div class="w-full pb-5" v-for="x in data" :key="x.id">
          <!-- header -->
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1">
              <div
                class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
                {{ x.index }}</div>
              <p class="flex-grow font-medium">{{ x.label }}</p>
            </div>
            <!-- handle -->
            <div v-if="x.status === 'show'" class="flex items-center">
              <el-button plain type="primary" size="small" @click="handleOpenEdit(x)">
                <el-icon :size="16">
                  <EditPen />
                </el-icon>
                <span>编辑</span>
              </el-button>
            </div>
          </div>

          <!-- content -->
          <div v-if="x.status === 'edit'" class="w-full">
            <el-input class="" type="textarea" :autosize="{ minRows: 2 }" v-model="x.editValue" />
            <div class="mt-3 w-full flex justify-end">
              <el-button size="small" @click="handleCancelEdit(x)">取消</el-button>
              <el-button type="primary" size="small" :loading="x.saveLoading" @click="handleSaveEdit(x)">保存</el-button>
            </div>
          </div>
          <!-- <div v-else class="w-full whitespace-pre-line text-[var(--el-text-color-regular)]">
            {{ x.content }}
          </div> -->
          <Markdown v-else :content="x.content" />
        </div>
      </div>

    </div>

    <el-empty v-else></el-empty>
  </div>
</template>
