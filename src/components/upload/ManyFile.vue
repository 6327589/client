<script setup>
import { uploadDoc } from 'api/common'
import { ElMessage, ElMessageBox } from 'element-plus'
import { h, ref, watch } from 'vue'
import { getDocType } from 'utils/file'
import { copy } from 'utils'

const emits = defineEmits(['update:modelValue', 'on-change'])
const props = defineProps({
  modelValue: Array,
  size: Number,
  width: {
    type: [Number, null],
    default: null,
  },
  height: {
    type: [Number, null],
    default: null,
  },
  multiple: {
    type: Boolean,
    default: true,
  },
  limit: {
    type: Number,
    default: 3,
  },
  title: {
    string: '上传图片',
  },
  docTypes: {
    type: Array,
    default: () => {
      return ['pdf']
    },
  },
})

const inputRef = ref(null)
const uploadLoading = ref(false)
const list = ref([])
const listFile = ref([])
const progress = ref(0)
watch(() => props.modelValue, val => {
  if (JSON.stringify(val) !== JSON.stringify(list.value)) {
    list.value = copy(val)
    list.value.map(x => x.public_url)
  }
}, { immediate: true, deep: true })
watch(listFile, val => {
  emits('update:modelValue', val)
  emits('on-change', val)
}, { deep: true })

const handleClick = () => {
  if (!uploadLoading.value) {
    inputRef.value.value = null
    inputRef.value.click()
  }
}
const handleChange = (e) => {
  const files = e.target.files
  if (!files) return
  if (!props.multiple) {
    uploadOneFile(files[0])
  } else {
    uploadManyFile(files)
  }
}

const checkFile = async (file, showErrorInfo = true) => {
  // check doc type
  const docType = await getDocType(file, props.docTypes)
  let errorInfo = ''
  if (!docType) {
    errorInfo = `文档格式不正确，只允许上传${props.docTypes.join(', ')}格式的文档`
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

const uploadOneFile = async (file) => {
  if (await checkFile(file)) { return }
  uploadLoading.value = true
  const data = {
    file,
  }
  uploadDoc(data, {
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
  }).then(res => {
    ElMessage.success('Upload Success')
    progress.value = 100
    list.value.push(res.public_url)
    listFile.value.push(res)
    uploadLoading.value = false
  }).catch(_ => {
    uploadLoading.value = false
  })
}

const uploadManyFile = async (files) => {
  const allFiles = []
  let currentLimit = props.limit - list.value.length
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
    }
    return uploadDoc(data, {
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
    if (allowFiles.length === allFiles.length) {
      const listUrl = []
      res.forEach((x) => {
        listUrl.push(x.public_url)
        listFile.value.push(x)
      })
      list.value.push(...listUrl)
      ElMessage.success('Upload Success')
    } else {
      const listUrl = []
      res.forEach((x) => {
        listUrl.push(x.public_url)
        listFile.value.push(x)
      })
      list.value.push(...listUrl)
      res.forEach((x, i) => {
        const index = allowFiles[i].index
        allFiles[index].url = x.public_url
      })
      showErrorInfo(allFiles)
    }
  } catch (err) {
    uploadLoading.value = false
  }
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
    title: 'Upload Error Info',
    message: h('div', null, html),
    showCancelButton: false,
    confirmButtonText: 'OK',
  })
}

const handleRemove = index => {
  list.value.splice(index, 1)
  listFile.value.splice(index, 1)
}

</script>

<template>
  <div class="upload-many-image">
    <template v-if="list.length">
      <div class="preview-box-doc" v-for="(item, index) in list" :key="index">
        <object :data="item" type="application/pdf" width="100%" height="100%">
          <p>您的浏览器不支持查看PDF，请<a :href="item">下载该文件</a>。</p>
        </object>
      </div>
    </template>
    <div class="upload-box" @click="handleClick" v-if="list.length < props.limit"
      v-loading="props.multiple && uploadLoading">
      <el-progress v-if="!props.multiple && uploadLoading" class="progress" type="circle" :percentage="progress" />
      <el-icon v-if="!uploadLoading" class="icon-plus">
        <plus />
      </el-icon>
    </div>

    <input type="file" ref="inputRef" name="file" class="upload-input" :multiple="props.multiple"
      @change="handleChange">
  </div>
</template>

<style lang="scss">
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}
.upload-many-image {
  display: flex;
  flex-wrap: wrap;
  width: 100%;

  .preview-box-doc {
    position: relative;
    box-sizing: border-box;
    width: 200px;
    height: 250px;
    margin-right: 16px;
    overflow: hidden;
    border: 1px solid var(--el-text-color-placeholder);
    border-radius: 4px;

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .preview-box-handle {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      font-size: 20px;
      color: #fff;
      background-color: #00000080;
      opacity: 0;
      transition: opacity var(--el-transition-duration);

      @include flex-center;

      .handle-icon {
        margin: 0 8px;
        cursor: pointer;
      }

      &:hover {
        opacity: 1;
      }
    }
  }

  .upload-box {
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    cursor: pointer;
    border: 1px dashed var(--el-text-color-placeholder);
    border-radius: 4px;

    @include flex-center;

    .icon-plus {
      font-size: 30px;
      color: var(--el-text-color-secondary);
    }

    .progress {
      width: 90px;
      height: 90px;

      .el-progress-circle {
        width: 100% !important;
        height: 100% !important;
      }
    }

    &:hover {
      border-color: var(--el-color-primary);

      .icon-plus {
        font-size: 32px;
      }
    }
  }

  .upload-input {
    display: none;
  }
}
</style>
