<script setup>
import { classnames, copy } from '@/utils'
import { onMounted, ref, h, watch } from 'vue'
import { uploadImage } from '@/api/common'
import { ElMessageBox, ElMessage } from 'element-plus'
import Sortable from 'sortablejs'
import { getImageType } from 'utils/file'

const props = defineProps({
  list: Array,
  multiple: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: 6,
  },
  imageTypes: {
    type: Array,
    default: () => {
      return ['png', 'jpg', 'gif']
    },
  },
})

const inputRef = ref(null)
const uploadLoading = ref(false)
const progress = ref(0)

const handleClick = () => {
  if (!uploadLoading.value) {
    inputRef.value.value = null
    inputRef.value.click()
  }
}
const handleChange = (e) => {
  const files = e.target.files
  if (!files) return
  uploadManyFile(files)
}

const checkFile = async (file, showErrorInfo = true) => {
  // check img type
  const imgType = await getImageType(file, props.imageTypes)
  let errorInfo = ''
  if (!imgType) {
    errorInfo = `图片格式不正确，只允许上传${props.imageTypes.join(', ')}格式的图片`
    showErrorInfo && ElMessage.error(errorInfo)
    return errorInfo
  }

  // check source size
  if (props.size && file.size > props.size * 1024 * 1024) {
    errorInfo = `上传文件过大，最大允许${props.size}MB`
    showErrorInfo && ElMessage.error(errorInfo)
    return errorInfo
  }

  return ''
}

const showErrorInfo = (allFiles) => {
  const html = allFiles.map(x => {
    if (x.errorInfo) {
      return h('p', { class: 'r-text-danger' }, `${x.index + 1}.${x.name}: ${x.errorInfo}`)
    } else {
      return h('p', { class: 'r-text-success' }, `${x.index + 1}.${x.name}: Upload Success`)
    }
  })
  ElMessageBox({
    title: '上传失败信息',
    message: h('div', null, html),
    showCancelButton: false,
    confirmButtonText: 'OK',
  })
}
const uploadManyFile = async (files) => {
  const allFiles = []
  let currentLimit = props.limit - currentList.value.length
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    let errorInfo = ''
    if (currentLimit > 0) {
      errorInfo = await checkFile(file, false)
      if (!errorInfo) {
        currentLimit--
      }
    } else {
      errorInfo = `超出限制数量${props.limit}`
    }
    allFiles.push({ index: i, errorInfo, file, name: file.name, url: '' })
  }
  const allowFiles = allFiles.filter(x => !x.errorInfo)
  if (!allowFiles.length) {
    showErrorInfo(allFiles)
    return
  }

  const apis = allowFiles.map(x => {
    const data = {
      file: x.file,
      purpose: 'general',
    }
    return uploadImage(data, {
      timeout: 0,
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e) => {
        if (e.total > 0) {
          const percent = Number(((e.loaded / e.total) * 100).toFixed(2))
          if (percent >= 99) {
            progress.value = 99
          } else {
            progress.value = percent
          }
        }
      },
    })
  })
  uploadLoading.value = true
  try {
    const res = await Promise.all(apis)
    uploadLoading.value = false
    const arr = []
    res.forEach((x) => {
      arr.push({
        url: x.public_url,
        desc: '',
      })
    })
    console.log('arr', arr)
    currentList.value.push(...arr)
  } catch (err) {
    uploadLoading.value = false
  }
}

const currentList = ref([])
const indexList = ref([])
const start = ref(0)
let sortableInstance = null

const sortBoxRef = ref(null)

const init = (list) => {
  currentList.value = list.map((x, i) => {
    x.id = i
    return x
  })
  start.value = currentList.value.length
  indexList.value = Array.from({ length: currentList.value.length }, (v, i) => {
    return { id: i }
  })

  console.log('init', currentList.value, indexList.value)
  if (sortableInstance) {
    sortableInstance.destroy()
  }

  sortableInstance = Sortable.create(sortBoxRef.value, {
    handle: '.sortable-stage-handle',
    animation: 500,
    ghostClass: 'stage-sortable-ghost-class',
    fallbackClass: 'stage-sortable-fallback-class',
    forceFallback: true,
    onStart (evt) {
      // this.stageIsDragging = true
    },
    onEnd (evt) {
      // this.stageIsDragging = false
    },
    onUpdate (e) {
      const { oldIndex, newIndex } = e
      console.log('index', e, oldIndex, newIndex)

      // 重新排序数据
      const movedItem = currentList.value.splice(oldIndex, 1)[0]
      currentList.value.splice(newIndex, 0, movedItem)
    },
  })
}

watch(() => props.list, (val) => {
  currentList.value = copy(val)
}, { immediate: true })

// watch(() => currentList.value.length, (val) => {
//   // const list = []
//   // indexList.value.forEach((x, i) => {
//   //   const item = currentList.value.find(y => y.id === x.id)
//   //   list.push(item)
//   // })
//   init(copy(currentList.value))
// })

const handleDelete = (item, index) => {
  currentList.value.splice(index, 1)

  // console.log('delete', index, id)
  // const index2 = indexList.value.findIndex(x => x.id === id)
  // indexList.value.splice(index2, 1)
}

const getListData = () => {
  return currentList.value
}

defineExpose({
  getListData,
})
</script>

<template>
  <div class="w-full py-2">
    <div class="w-full flex flex-col stage-list"
      ref="sortBoxRef"
    >
      <div v-for="(item, i) in currentList" :key="i"
        :class="classnames('mb-5 w-full flex gap-6 sortable-stage-handle',
        )"
      >
        <el-image class="flex-none w-30 h-30 select-none border rounded-lg"
          :src="item.url"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[item.url]"
          fit="cover"
        />
        <el-input class="flex-grow" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="附图说明" v-model="item.desc"></el-input>
        <div class="h-full flex items-center justify-center">
          <el-button type="danger" size="small" @click="handleDelete(item)">
            <el-icon><Delete/></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <input type="file" ref="inputRef" name="file" class="hidden" :multiple="props.multiple" @change="handleChange">
    <div class="w-full border border-dashed py-6 flex items-center justify-center rounded-xl gap-4 cursor-pointer"
      v-loading="uploadLoading"
      @click="handleClick"
    >
      <el-icon size="24"><Plus /></el-icon>
      添加附图
    </div>
  </div>

</template>

<style lang="scss" scoped>
.stage-list{
  .stage-sortable-ghost-class{
    border: 1px dashed #000 !important;;
    opacity: 0.3;
  }
  .stage-sortable-fallback-class{
    transform-origin: 0 0;
    transform: rotate(2deg);
    box-shadow: 0 0 30px 5px #9a9898 !important;
  }
  .task-sortable-ghost-class{
    border: 1px dashed #000 !important;
    opacity: 0.3;
  }
  .task-sortable-fallback-class{
    transform-origin: 0 0;
    transform: rotate(2deg);
    box-shadow: 0 0 30px 5px #9a9898 !important;
  }
}
</style>
