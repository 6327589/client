<script setup>
import { uploadDoc } from 'api/common'
import { ElMessage } from 'element-plus'
import { ref, watch } from 'vue'
import { getDocType, getImagePixel } from 'utils/file'

const emits = defineEmits(['update:modelValue', 'on-change'])
const props = defineProps({
  modelValue: [Object, String],
  meta: [Object, null],
  size: Number,
  selectType: {
    type: String,
    default: 'plus', // plus/button
  },
  sourceType: {
    type: String,
    default: 'image', // image/video
  },
  width: {
    type: [Number, null],
    default: null,
  },
  height: {
    type: [Number, null],
    default: null,
  },
  title: {
    type: String,
    default: '上传图片',
  },
  imageTypes: {
    type: Array,
    default: () => {
      return ['pdf']
    },
  },
})

const inputRef = ref(null)
const uploadLoading = ref(false)
const fileRes = ref({
  url: '',
  file_id: 0,
})
const progress = ref(0)

watch(() => props.modelValue, val => {
  if (val !== fileRes.value.url) {
    fileRes.value.url = val
  }
}, { immediate: true })
watch(fileRes, val => {
  emits('update:modelValue', val)
  emits('on-change', val)
})

const handleClick = () => {
  if (!uploadLoading.value) {
    inputRef.value.value = null
    inputRef.value.click()
  }
}
const handleChange = (e) => {
  const files = e.target.files
  if (!files) return
  uploadFiles(files)
}
const uploadFiles = async (files) => {
  const file = files[0]
  if (props.sourceType === 'image') {
    // check img type
    const imgType = await getDocType(file, props.imageTypes)
    if (!imgType) {
      ElMessage.error(`文件格式不正确，只允许上传${props.imageTypes.join(', ')}格式的文件`)
      return
    }
  } else if (props.sourceType === 'video') {
    // check video
    if (!file.type.startsWith('video')) {
      ElMessage.error('视频格式不正确')
      return
    }
  }

  // check source size
  if (props.size && file.size > props.size * 1024 * 1024) {
    ElMessage.error(`上传文件过大，最大允许${props.size}MB`)
    return
  }

  // check image width/height
  if (props.width) {
    const { width, height } = await getImagePixel(file)
    if (width !== props.width || height !== props.height) {
      ElMessage.error(`上传图片尺寸不符，允许尺寸：${props.width}*${props.height}; 所选图片尺寸：${width}*${height}`)
      return
    }
  }

  uploadLoading.value = true
  const data = {
    file,
  }
  const res = await uploadDoc(data, {
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
  fileRes.value.url = res.public_url
  fileRes.value.file_id = res.file_id
  uploadLoading.value = false
}

const handleRemove = () => {
  fileRes.value.url = ''
  fileRes.value.file_id = 0
}

// preview Image
// const previewStore = usePreviewStore()
// const handlePreviewImage = () => {
//   previewStore.showPreviewImage([fileRes.value.url], 0)
// }

</script>

<template>
  <div class="upload-one-image">
    <template v-if="props.selectType === 'plus'">
      <div class="preview-box" v-if="fileRes.url">
        <object :data="fileRes.url" type="application/pdf" width="100%" height="100%">
          <p>您的浏览器不支持查看PDF，请<a :href="item">下载该文件</a>。</p>
        </object>
        <div class="preview-box-handle">
          <!-- <el-icon class="handle-icon" @click="handlePreviewImage"><zoom-in /></el-icon> -->
          <el-icon class="handle-icon" @click="handleRemove">
            <delete />
          </el-icon>
        </div>
      </div>
      <div v-else class="upload-box" @click="handleClick">
        <el-progress v-if="uploadLoading" class="progress" type="circle" :percentage="progress" />
        <el-icon v-else class="icon-plus">
          <plus />
        </el-icon>
      </div>
    </template>
    <el-button v-else type="primary" :loading="uploadLoading" @click="handleClick">{{ props.title }}</el-button>
    <input class="upload-input" type="file" ref="inputRef" name="file" @change="handleChange">

  </div>
</template>

<style lang="scss">
@mixin flex-center($direction: row) {
  display: flex;
  flex-direction: $direction;
  align-items: center;
  justify-content: center;
}
.upload-one-image {
  display: inline-block;

  .preview-box {
    position: relative;
    box-sizing: border-box;
    width: 100px;
    height: 100px;
    overflow: hidden;
    border: 1px solid var(--el-text-color-placeholder);
    border-radius: 4px;

    .img {
      width: 100px;
      height: 100px;
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
