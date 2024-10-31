<script setup>
import { computed, onMounted, ref, toRaw, watch } from 'vue'
import Menu from '../components/Menu.vue'
import Session from '../components/Session.vue'
import Preview from '../components/Preview.vue'
import { listRecord, createRecord, updateRecord } from '@/api/write'
import { useRoute } from 'vue-router'
import useWriteLocalStore from '@/stores/write'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: String,
})

const writeLocalStore = useWriteLocalStore()

const route = useRoute()

const draftId = Number(route.params.id)

const fieldMap = computed(() => {
  return writeLocalStore.fieldMap
})
const sendLoading = computed(() => {
  return writeLocalStore.sendLoading
})

const list = ref([])
const currentMenu = ref(null)
const setCurrentMenu = (item) => {
  if (sendLoading.value) return
  item = !item.items ? item : item.items[0]
  if (currentMenu.value?.recordId === item.recordId) return
  currentMenu.value = {
    order: item.order,
    pOrder: item.pOrder,
    pid: item.pid,
    id: item.id,
    fieldId: item.fieldId,
    recordId: item.recordId,
    key: item.key,
    start_prompt: item.start_prompt,
    tip: item.tip,
    min_word: item.min_word,
  }
}

function getRecord (list) {
  const paragraphMap = {}
  let implementationCount = 0
  let lastImplementation = null

  // 首先按照paragraph分组
  list.forEach(item => {
    let paragraphName = item.paragraph
    if (paragraphName === '具体实施方式（必填）') {
      if (lastImplementation && lastImplementation.children.length < 2) {
        // 继续使用上一个实施例
        paragraphName = lastImplementation.paragraph
      } else {
        // 创建新的实施例
        implementationCount++
        paragraphName = `具体实施方式${implementationCount}（必填）`
      }
    }

    if (!paragraphMap[paragraphName]) {
      paragraphMap[paragraphName] = {
        paragraph: paragraphName,
        children: [],
      }
      if (paragraphName.startsWith('具体实施方式')) {
        lastImplementation = paragraphMap[paragraphName]
      }
    }

    if (item.name_zh) {
      paragraphMap[paragraphName].children.push({
        name_zh: item.name_zh,
        ID: item.ID,
        fieldId: item.field_id,
      })
    } else if (!paragraphName.startsWith('具体实施方式')) {
      // 只有非实施例的段落才直接添加ID
      paragraphMap[paragraphName].ID = item.ID
      paragraphMap[paragraphName].fieldId = item.field_id
    }
  })

  // 将map转换为数组
  let result = Object.values(paragraphMap)

  // 对每个paragraph的children进行排序，并处理没有children的项
  result = result.map((item, index) => {
    if (item.children && item.children.length > 0) {
      item.children = item.children.map((xx, ii) => {
        const fieldData = toRaw(fieldMap.value[xx.fieldId])
        const recordData = list.find(x => x.ID === xx.ID)
        return {
          pOrder: index,
          order: ii,
          pid: index,
          id: xx.ID,
          recordId: xx.ID,
          label: xx.name_zh,
          fieldId: xx.fieldId,
          content: recordData.content,
          key: fieldData.key,
          start_prompt: fieldData.start_prompt,
          tip: fieldData.tip,
          min_word: fieldData.min_word,
          editValue: '',
          saveLoading: false,
          isEdit: false,
        }
      })
      return {
        pOrder: index,
        order: index,
        index: (index + 1 + '').padStart(2, '0'),
        pid: index,
        id: index,
        label: item.paragraph,
        items: item.children,
      }
    } else {
      // 如果没有children，直接返回{ID, paragraph}
      const fieldData = toRaw(fieldMap.value[item.fieldId])
      const recordData = list.find(x => x.ID === item.ID)
      return {
        pOrder: index,
        order: index,
        index: (index + 1 + '').padStart(2, '0'),
        pid: index,
        id: item.ID,
        recordId: item.ID,
        label: item.paragraph,
        fieldId: item.fieldId,
        content: recordData.content,
        key: fieldData.key,
        start_prompt: fieldData.start_prompt,
        tip: fieldData.tip,
        min_word: fieldData.min_word,
        editValue: '',
        saveLoading: false,
        isEdit: false,
      }
    }
  })
  return result
}
function getClaimRecord (list) {
  return list.map((item, index) => {
    const fieldData = toRaw(fieldMap.value[item.field_id])
    return {
      pOrder: index,
      order: index,
      index: (index + 1 + '').padStart(2, '0'),
      pid: index,
      id: item.ID,
      recordId: item.ID,
      label: item.paragraph,
      fieldId: item.field_id,
      content: item.content,
      key: fieldData.key,
      start_prompt: fieldData.start_prompt,
      tip: fieldData.tip,
      min_word: fieldData.min_word,
      editValue: '',
      saveLoading: false,
      isEdit: false,
    }
  })
}

const initLoading = ref(true)

const initRecord = async () => {
  const recordRes = await listRecord({ category: props.type, draft_id: draftId })
  const recordList = recordRes.Data || []
  if (props.type === 'claim') {
    list.value = getClaimRecord(recordList)
  } else {
    list.value = getRecord(recordList)
  }
  initLoading.value = false
  if (!currentMenu.value) {
    setCurrentMenu(list.value[0])
  }
}

onMounted(() => {
  initRecord()
})

const addRecord = async () => {
  if (props.type === 'claim') {
    for (const item of list.value) {
      if (item.content === '') {
        ElMessage.warning(`为保证更好的输出效果，请先完成前面内容 “${item.label}” 的输入`)
        return
      }
    }
  } else if (props.type === 'description') {
    for (const item of list.value) {
      if (item.label.startsWith('具体实施方式') && item.items.some(x => x.content === '')) {
        ElMessage.warning(`为保证更好的输出效果，请先完成前面内容 “${item.label}” 的输入`)
        return
      }
    }
  }
  const createBody = {
    category: props.type,
    draft_id: draftId,
  }
  await createRecord(createBody)
  initRecord()
}

const updateAnswer = ({ action, answer }) => {
  let item
  const pItem = list.value.find(x => x.pid === currentMenu.value.pid)
  if (!pItem.key) {
    item = pItem.items.find(x => x.key === currentMenu.value.key)
  } else {
    item = pItem
  }
  const newValue = action === 'add' ? item.content + answer : answer

  const body = {
    draft_id: draftId,
    new_content: newValue,
    record_id: currentMenu.value.recordId,
  }
  updateRecord(body).then(res => {
    item.content = newValue
  })
}

const checkEmpty = () => {
  for (const pItem of list.value) {
    if (!pItem.items) {
      if (pItem.pOrder < currentMenu.value.pOrder && pItem.order < currentMenu.value.order && pItem.content === '') {
        ElMessage.warning(`为保证更好的输出效果，请先完成前面内容 “${pItem.label}” 的输入`)
        return
      }
    } else {
      for (const x of pItem.items) {
        if (x.pOrder < currentMenu.value.pOrder && x.content === '') {
          ElMessage.warning(`为保证更好的输出效果，请先完成前面内容 “${x.label}” 的输入`)
          return
        }
        if (x.pOrder === currentMenu.value.pOrder && x.order < currentMenu.value.order && x.content === '') {
          ElMessage.warning(`为保证更好的输出效果，请先完成前面内容 “${x.label}” 的输入`)
          return
        }
      }
    }
  }
}
watch(() => currentMenu.value, (value) => {
  if (value) {
    checkEmpty()
  }
})
</script>

<template>
  <div class="w-full h-full flex" v-loading="initLoading">
    <!-- left -->
    <div class="flex-grow bg-white border border-light
      flex flex-col
    ">
      <Menu :type="type" :list="list" :currentMenu="currentMenu"
        @onAddRecord="addRecord"
        @onSelectRecord="setCurrentMenu"
      />

      <!-- chat -->
      <Session :type="type" :currentMenu="currentMenu"
        @onUpdateAnswer="updateAnswer"
      />
    </div>

    <!-- right -->
    <Preview :type="type" :list="list" :currentMenu="currentMenu"
      @onAddRecord="addRecord"
      @onSelectRecord="setCurrentMenu"
    />
  </div>
</template>
