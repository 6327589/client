<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { classnames, copy } from '@/utils'
import useWriteLocalStore from '@/stores/write'
import { listRecord, createRecord, updateRecord } from '@/api/write'
import { useRoute, useRouter } from 'vue-router'
import Markdown from './Markdown.vue'
import { ElMessage } from 'element-plus'
import useCommonStore from '@/stores/common'

const emits = defineEmits([
  'on-add-record',
  'on-select-record',
])
const props = defineProps({
  type: String,
  list: Array,
  currentMenu: Object,
})

const commonStore = useCommonStore()
const route = useRoute()
const router = useRouter()
const writeLocalStore = useWriteLocalStore()

const draftId = Number(route.params.id)

// const initHeight = () => {
//   const contentList = document.querySelectorAll('.preview-wrapper .content-box')
//   console.log('contentList', contentList)
//   currentPageList.value.forEach((item, index) => {
//     const domItem = contentList[index]
//     if (!domItem) return
//     const { height } = domItem.getBoundingClientRect()
//     writeLocalStore.setBoxHeight(item.id, height)
//   })
// }
// const setItemHeight = (item) => {
//   const contentItem = document.querySelectorAll('.preview-wrapper .content-box')[item.i]
//   if (!contentItem) return
//   const { height } = contentItem.getBoundingClientRect()
//   writeLocalStore.setBoxHeight(item.id, height)
// }

const handleOpenEdit = (item) => {
  item.saveLoading = false
  if (!item.items) {
    item.editValue = item.content
  } else {
    item.items.forEach(x => {
      x.editValue = x.content
    })
  }
  item.isEdit = true
}
const handleCancelEdit = (item) => {
  item.saveLoading = false
  if (!item.items) {
    item.editValue = ''
  } else {
    item.items.forEach(x => {
      x.editValue = ''
    })
  }
  item.isEdit = false
}
const handleSaveEdit = async (item) => {
  try {
    if (!item.items) {
      if (item.editValue === '') {
        ElMessage.error(`${item.label} 内容不能为空`)
        return
      }
      item.saveLoading = true
      const body = {
        draft_id: draftId,
        new_content: item.editValue,
        record_id: item.recordId,
      }
      await updateRecord(body)
      item.content = item.editValue
      item.editValue = ''
    } else {
      if (item.items.some(x => x.editValue === '')) {
        ElMessage.error('内容不能为空')
        return
      }
      item.saveLoading = true
      const apis = item.items.map(x => {
        return updateRecord({
          draft_id: draftId,
          new_content: x.editValue,
          record_id: x.recordId,
        })
      })
      await Promise.all(apis)
      item.items.forEach(x => {
        x.content = x.editValue
        x.editValue = ''
      })
    }
    item.saveLoading = false
    item.isEdit = false
  } catch (e) {
    item.saveLoading = false
  }
}
const handleSetOpen = (item) => {
}

const selectRecord = (item) => {
  emits('on-select-record', item)
}

const listWrapperRef = ref(null)

const handleNext = () => {
  if (route.name === 'Write_Interaction_Description') {
    router.push({ name: 'Write_Interaction_Summary' })
  } else if (route.name === 'Write_Interaction_Summary') {
    router.push({ name: 'Write_Interaction_Polish' })
  }
}

const handleAddItem = async () => {
  emits('on-add-record')
}

</script>

<template>
  <div
    class="w-[390px] h-full border-y border-r border-light flex-none bg-white bg-opacity-60 flex flex-col overflow-hidden">
    <h1 class="flex-none text-lg font-medium text-center mt-6 mb-2"
      :ref="(el) => commonStore.setTourList(el, 8, '您可在此对生成内容进行编辑和预览')">编辑预览</h1>
    <div class="flex-grow w-full flex flex-col gap-2 px-4 py-2 overflow-auto preview-wrapper"
      ref="listWrapperRef">
      <div v-for="item in list" :key="item.index" :class="classnames(`w-full border border-light px-4 pt-3 pb-2 rounded bg-white cursor-pointer
          hover:border-[var(--el-color-primary)]`,
        currentMenu && currentMenu.pid === item.pid ? 'border-[var(--el-color-primary)]' : '',
      )" @click.stop="selectRecord(item)">
        <div class="flex items-center gap-1 mb-1.5 min-h-8">
          <div
            class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
            {{ item.index }}
          </div>
          <p class="flex-grow font-medium">{{ item.label }}</p>
          <div v-if="currentMenu && currentMenu.pid === item.pid" class="flex-none w-8 h-8 rounded flex items-center justify-center
            hover:bg-[var(--el-fill-color)]
          " @click.stop="handleOpenEdit(item)">
            <el-icon>
              <EditPen />
            </el-icon>
          </div>
        </div>

        <div v-if="item.isEdit">
          <div v-if="!item.items" class="w-full">
            <el-input class="" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="item.editValue" />
          </div>
          <div v-else class="w-full flex flex-col gap-4">
            <div class="w-full" v-for="(x, i) in item.items" :key="x.id">
              <h2 :class="classnames('font-medium',
                x.id === currentMenu?.id ? 'text-[var(--el-color-primary)] font-semibold' : 'font-medium',
              )">{{ i + 1 }}. {{ x.label }}</h2>
              <el-input class="" type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="x.editValue" />
            </div>
          </div>
          <div class="mt-3 w-full flex justify-end">
            <el-button size="small" @click.stop="handleCancelEdit(item)">取消</el-button>
            <el-button type="primary" size="small" v-loading="item.saveLoading"
              @click.stop="handleSaveEdit(item)">保存</el-button>
          </div>
        </div>
        <div v-else :class="classnames('leading-[22px] content-box transition-all duration-300 overflow-hidden',
        )" :style="{ '--height': `${item.height ? item.height + 'px' : 'auto'}` }">
          <div v-if="item.items" class="w-full flex flex-col gap-4">
            <div v-for="(x, i) in item.items" :key="x.id" @click.stop="selectRecord(x)">
              <h2 :class="classnames('font-medium',
                x.id === currentMenu?.id ? 'text-[var(--el-color-primary)] font-semibold' : 'font-medium',
              )">{{ i + 1 }}. {{ x.label }}</h2>
              <!-- <p class="text-[var(--el-text-color-regular)] whitespace-pre-line">{{ x.content }}</p> -->
              <Markdown :content="x.content" />
            </div>
          </div>
          <!-- <div v-else class="w-full text-[var(--el-text-color-regular)] whitespace-pre-line">
            {{ item.content }}
          </div> -->
          <Markdown v-else :content="item.content" />
        </div>

        <div class="flex items-center justify-center text-[var(--el-color-primary)] py-1.5 cursor-pointer"
          v-if="item.hasOpen && !item.isEdit" @click.stop="handleSetOpen(item)">
          <el-icon :class="classnames('transition-transform duration-300', item.isOpen ? 'rotate-180' : 'rotate-0')">
            <ArrowDown />
          </el-icon>
        </div>
      </div>

      <div class="flex-none w-full h-20 flex items-center justify-center border rounded border-dashed bg-white cursor-pointer group
        hover:border-[var(--el-color-primary)]
      " @click="handleAddItem">
        <el-icon class="text-[var(--el-text-color-secondary)] group-hover:text-[var(--el-color-primary)]" :size="30">
          <Plus />
        </el-icon>
      </div>

    </div>

    <div class="flex-none w-full p-4 bg-white border-t">
      <el-button class="w-full" type="primary" @click="handleNext"
        :ref="(el) => commonStore.setTourList(el, 9, ` 若以上信息无误，您可点击此按钮前往${route.name === 'Write_Interaction_Summary' ? '说明书' : '权利要求'}辅助撰写页面`)">
        {{ route.name === 'Write_Interaction_Summary' ? '前往全文检查/润色' : '前往说明书摘要辅助撰写' }}
      </el-button>
    </div>
  </div>
</template>
