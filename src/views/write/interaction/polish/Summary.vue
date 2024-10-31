<script setup>
import { ref, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { classnames, copy } from '@/utils'
import { updateRecord, runPolish, updatePolishContent } from '@/api/write'
import Markdown from '../components/Markdown.vue'
import useCommonStore from '@/stores/common'
const commonStore = useCommonStore()
const props = defineProps({
  type: String,
  draftId: Number,
  initData: Object,
})

const data = ref({
  status: 'show',
  isPolish: false,
  polishId: '',
  polishContent: '',
  polishLoading: '',
  polishEditValue: '',
  polishSaveLoading: false,
  items: [],
})

watch(() => props.initData, (val) => {
  data.value = copy(props.initData)
}, { immediate: true })

const handleOpenEdit = (item) => {
  item.editValue = item.content
  item.status = 'edit'
}
const handleSaveEdit = async (item) => {
  const body = {
    draft_id: props.draftId,
    new_content: item.editValue,
    record_id: item.record_id,
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

const handlePolish = async (data) => {
  for (const element of data.items) {
    const item = element
    if (item.content === '') {
      ElMessage.error(`“${item.label}” 内容为空，无法润色。`)
      data.isPolish = false
      return
    } else if (item.content.length < item.min_word) {
      ElMessage.error(`“${item.label}” 内容不能少于${item.min_word}个字，无法润色。`)
      data.isPolish = false
      return
    }
  }

  data.isPolish = true
  data.status = 'show'
  data.polishLoading = true
  const body = {
    category: props.type,
    draft_id: props.draftId,
  }
  try {
    const res = await runPolish(body)
    const content = res?.Data?.content || ''
    data.polishContent = content
    data.polishLoading = false
  } catch (e) {
    data.polishLoading = false
    data.isPolish = false
  }
}

const handleOpenEditPolish = (data) => {
  data.polishSaveLoading = false
  data.polishEditValue = data.polishContent
  data.status = 'edit'
}
const handleCancelEditPolish = (data) => {
  data.polishEditValue = ''
  data.status = 'show'
}
const handleSaveEditPolish = async (data) => {
  if (data.polishEditValue === '') {
    ElMessage.error('润色内容不能为空')
    return
  }
  const body = {
    category: props.type,
    draft_id: props.draftId,
    draft_polish_id: data.polishId,
    field_id: 1,
    new_content: data.polishEditValue,
  }
  data.polishSaveLoading = true
  await updatePolishContent(body)
  data.polishContent = data.polishEditValue
  data.polishEditValue = ''
  data.polishSaveLoading = false
  data.status = 'show'
}

const handleChangeIsPolish = (data) => {
  if (data.isPolish) {
    handlePolish(data)
  } else {
    data.items.forEach(x => {
      x.editValue = ''
    })
    data.polishEditValue = ''
    data.status = 'show'
  }
}

const canPolish = computed(() => {
  return !data.value.items.some(x => x.status === 'edit')
})

</script>

<template>
  <div class="mt-5 w-full">

    <h1 class="pt-6 pb-5 text-lg font-medium text-center ">
      <div class="w-full relative">
        说明书摘要
        <div v-if="data.items.length" class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
          <div v-if="data.isPolish">
            <el-button v-if="data.status === 'show' && !data.polishLoading" plain type="primary" size="small"
              @click="handleOpenEditPolish(data)">
              <el-icon :size="16">
                <EditPen />
              </el-icon>
              <span>编辑润色结果</span>
            </el-button>
            <!-- <el-button plain type="primary" size="small" @click="handleChangeIsPolish(data)">
              <el-icon><PolishIcon /></el-icon>
              <span>润色</span>
            </el-button> -->
          </div>
          <div v-else>
            <!-- <el-button type="primary" size="small"
              @click="handlePolish(data)"
            >
              <el-icon><PolishIcon /></el-icon>
              <span>润色</span>
            </el-button> -->
          </div>

          <el-switch v-if="data.status === 'show' && !data.polishLoading && canPolish" size="large" inline-prompt
            style="--el-switch-on-color: #669751; --el-switch-off-color: #256b07" active-text="切换到编辑模式"
            inactive-text="开始检查/润色" class="ml-2" v-model="data.isPolish" @change="handleChangeIsPolish(data)"
            :ref="(el) => commonStore.setTourList(el, 1, '请点击“开始检查/润色”进行说明书摘要部分的润色\n请点击“编辑/润色结果”对润色内容进行二次修改')" />
        </div>
      </div>
    </h1>
    <div v-if="data.items.length" class="w-full">

      <!-- 撰写模式 -->
      <div v-if="!data.isPolish" :class="classnames('leading-[22px]')">
        <div class="w-full pb-5" v-for="x in data.items" :key="x.id">
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

      <!-- 润色模式 -->
      <div v-else class="w-full">
        <div v-if="data.status === 'edit'" class="w-full">
          <el-input class="" type="textarea" :autosize="{ minRows: 2 }" v-model="data.polishEditValue" />
          <div class="mt-3 w-full flex justify-end">
            <el-button size="small" @click="handleCancelEditPolish(data)">取消</el-button>
            <el-button type="primary" size="small" :loading="data.polishSaveLoading"
              @click="handleSaveEditPolish(data)">保存</el-button>
          </div>
        </div>
        <div v-else class="w-full" v-loading="data.polishLoading">
          <!-- <div class="w-full whitespace-pre-line text-[var(--el-text-color-regular)]">
            {{ data.polishContent }}
          </div> -->
          <Markdown :content="data.polishContent" />
        </div>
      </div>
    </div>

    <el-empty v-else></el-empty>
  </div>
</template>
