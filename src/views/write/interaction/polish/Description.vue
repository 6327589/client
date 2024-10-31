<script setup>
import { ref, watch, computed } from 'vue'
import { classnames, copy } from '@/utils'
import { ElMessage } from 'element-plus'
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
  item.saveLoading = false
  if (!item.items) {
    item.editValue = item.content
  } else {
    item.items.forEach(x => {
      x.editValue = x.content
    })
  }
  item.status = 'edit'
}
const handleSaveEdit = async (item) => {
  try {
    if (!item.items) {
      if (item.editValue === '') {
        ElMessage.error(`“${item.label}” 内容为空，无法保存。`)
        return
      } else if (item.editValue.length < item.min_word) {
        ElMessage.error(`“${item.label}” 内容不能少于${item.min_word}个字，无法保存。`)
        return
      }
      const body = {
        draft_id: props.draftId,
        new_content: item.editValue,
        record_id: item.recordId,
      }
      item.saveLoading = true
      await updateRecord(body)
      item.content = item.editValue
      item.editValue = ''
    } else {
      for (const element of item.items) {
        const item = element
        if (item.editValue === '') {
          ElMessage.error(`“${item.label}” 内容为空，无法保存。`)
          return
        } else if (item.editValue.length < item.min_word) {
          ElMessage.error(`“${item.label}” 内容不能少于${item.min_word}个字，无法保存。`)
          return
        }
      }
      const apis = item.items.map(x => {
        return updateRecord({
          draft_id: props.draftId,
          new_content: x.editValue,
          record_id: x.recordId,
        })
      })
      item.saveLoading = true
      await Promise.all(apis)
      item.items.forEach(x => {
        x.content = x.editValue
        x.editValue = ''
      })
    }
    item.saveLoading = false
    item.status = 'show'
  } catch (e) {
    item.saveLoading = false
  }
}
const handleCancelEdit = (item) => {
  if (!item.items) {
    item.editValue = ''
  } else {
    item.items.forEach(x => {
      x.editValue = ''
    })
  }
  item.status = 'show'
}

const handleOpenEditPolish = (item) => {
  item.polishSaveLoading = false
  item.polishEditValue = item.polishContent
  item.status = 'edit'
}
const handleCancelEditPolish = (item) => {
  item.polishEditValue = ''
  item.status = 'show'
}
const handleSaveEditPolish = async (item) => {
  if (item.polishEditValue === '') {
    ElMessage.error('润色内容不能为空')
    return
  }
  const body = {
    category: props.type,
    draft_id: props.draftId,
    draft_polish_id: item.polishId,
    field_id: item.fieldId,
    new_content: item.polishEditValue,
  }
  item.polishSaveLoading = true
  try {
    await updatePolishContent(body)
    item.polishContent = item.polishEditValue
    item.polishEditValue = ''
    item.polishSaveLoading = false
    item.status = 'show'
  } catch (e) {
    item.polishSaveLoading = false
  }
}

const handlePolish = async (data) => {
  for (const item of data.items) {
    if (!item.items) {
      if (item.content === '') {
        ElMessage.error(`${item.label}内容为空，无法润色。`)
        data.isPolish = false
        return
      } else if (item.content.length < item.min_word) {
        ElMessage.error(`${item.label}内容不能少于${item.min_word}个字，无法润色。`)
        data.isPolish = false
        return
      }
    } else {
      for (const element of item.items) {
        if (element.content === '') {
          ElMessage.error(`${element.label}内容为空，无法润色。`)
          data.isPolish = false
          return
        } else if (element.content.length < element.min_word) {
          ElMessage.error(`${element.label}内容不能少于${element.min_word}个字，无法润色。`)
          data.isPolish = false
          return
        }
      }
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
const handleChangeIsPolish = async (data) => {
  if (data.isPolish) {
    handlePolish(data)
  } else {
    data.items.forEach(x => {
      if (x.items) {
        x.items.forEach(xx => {
          xx.editValue = ''
        })
      } else {
        x.editValue = ''
      }
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
        {{ type === 'abstract'? '说明书摘要' : '说明书'}}
        <div v-if="data.items.length" class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center">
          <div v-if="data.isPolish">
            <el-button v-if="data.status === 'show' && !data.polishLoading" plain type="primary" size="small"
              @click="handleOpenEditPolish(data)">
              <el-icon :size="16">
                <EditPen />
              </el-icon>
              <span>编辑润色结果</span>
            </el-button>
          </div>

          <el-switch v-if="data.status === 'show' && !data.polishLoading && canPolish" size="large" inline-prompt
            style="--el-switch-on-color: #669751; --el-switch-off-color: #256b07" active-text="切换到编辑模式"
            inactive-text="开始检查/润色" class="ml-2" v-model="data.isPolish" @change="handleChangeIsPolish(data)"
            :ref="(el) => commonStore.setTourList(el, 1, '请点击“开始检查/润色”进行说明书摘要部分的润色\n请点击“编辑/润色结果”对润色内容进行二次修改')" />
        </div>
      </div>
    </h1>

    <div v-if="data.items.length" class="w-full">

      <!-- 编辑模式 -->
      <div v-if="!data.isPolish" :class="classnames('leading-[22px]')">
        <div v-for="item in data.items" :key="item.index" :class="classnames(`w-full pb-10 rounded bg-white cursor-pointer`,
        )">
          <div class="flex items-center justify-between mb-3">
            <div class="flex items-center gap-1">
              <div
                class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
                {{ item.index }}</div>
              <p class="flex-grow font-medium">{{ item.label }}</p>
            </div>
            <div class="flex items-center">
              <div v-if="item.isPolish" class="w-full">
                <div v-if="item.status === 'show' && !item.polishLoading">
                  <el-button plain type="primary" size="small" @click="handleOpenEditPolish(item)">
                    <el-icon :size="16">
                      <EditPen />
                    </el-icon>
                    <span>编辑润色结果</span>
                  </el-button>
                </div>
              </div>
              <div v-else class="w-full">
                <div v-if="item.status === 'show' && !item.polishLoading">
                  <el-button plain type="primary" size="small" @click="handleOpenEdit(item)">
                    <el-icon :size="16">
                      <EditPen />
                    </el-icon>
                    <span>编辑</span>
                  </el-button>
                </div>
              </div>
            </div>
          </div>

          <div class="w-full">
            <div v-if="item.status === 'edit'">
              <div v-if="!item.items" class="w-full">
                <el-input class="" type="textarea" :autosize="{ minRows: 2 }" v-model="item.editValue" />
              </div>
              <div v-else class="w-full flex flex-col gap-2">
                <div class="w-full pb-5" v-for="(x, i) in item.items" :key="x.id">
                  <h2 class="font-medium">{{ i + 1 }}. {{ x.label }}</h2>
                  <el-input class="" type="textarea" :autosize="{ minRows: 2 }" v-model="x.editValue" />
                </div>
              </div>

              <div class="mt-3 w-full flex justify-end">
                <el-button size="small" @click="handleCancelEdit(item)">取消</el-button>
                <el-button type="primary" size="small" :loading="item.saveLoading"
                  @click="handleSaveEdit(item)">保存</el-button>
              </div>
            </div>

            <!-- item.status = 'show' -->
            <div v-else class="w-full leading-[22px]">
              <div v-if="item.items" class="w-full flex flex-col">
                <div v-for="(x, i) in item.items" :key="x.id" class="pb-5">
                  <h2 class="font-medium">{{ i + 1 }}. {{ x.label }}</h2>
                  <!-- <p class="whitespace-pre-line text-[var(--el-text-color-regular)]">{{ x.content }}</p> -->
                  <Markdown :content="x.content" />
                </div>
              </div>
              <!-- <div v-else class="w-full whitespace-pre-line text-[var(--el-text-color-regular)]">
                {{ item.content }}
              </div> -->
              <Markdown v-else :content="item.content" />
            </div>
          </div>

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
        <div v-else class="w-full min-h-[100px]" v-loading="data.polishLoading">
          <Markdown :content="data.polishContent" />
        </div>
      </div>

    </div>

    <el-empty v-else></el-empty>
  </div>
</template>
