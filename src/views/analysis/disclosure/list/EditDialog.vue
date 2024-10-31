<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addPatentDisclosure, updatePatentDisclosureTitle } from '@/api/analysis'

const emits = defineEmits(['update:visible', 'editSuccess'])
const props = defineProps({
  visible: Boolean,
  data: Object,
})

const thisVisible = ref(false)

const formRef = ref(null)
const inputRef = ref(null)

watch(() => props.visible, val => {
  if (val) {
    thisVisible.value = val
    if (props.data.id) {
      formData.value.name = props.data.name
    }
    // inputRef.value && inputRef.value.focus()
  } else {
    formRef.value && formRef.value.resetFields()
  }
}, { immediate: true })

watch(thisVisible, val => {
  emits('update:visible', val)
})

const formData = ref({
  name: '',
  type: '3',
})
const formRule = {
  name: [
    { required: true, type: 'string', message: '请输入名称', trigger: 'blur' },
  ],
  type: [
    { required: true, type: 'string', message: '请选择类型', trigger: 'change' },
  ],
}

const typeList = [
  { label: '新颖性分析', value: '1' },
  { label: '创造性分析', value: '2' },
  { label: '交底查新', value: '3' },
]

const submitLoading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      if (!props.data.id) {
        const body = {
          title: formData.value.name,
          type: formData.value.type,
        }
        addPatentDisclosure(body).then(res => {
          ElMessage.success('新建成功')
          handleCancel()
          emits('editSuccess')
        }).finally(() => {
          submitLoading.value = false
        })
      } else {
        const body = {
          disclosure_id: props.data.id,
          new_title: formData.value.name,
        }
        updatePatentDisclosureTitle(body).then(res => {
          ElMessage.success('修改项目名称成功')
          handleCancel()
          emits('editSuccess')
        }).finally(() => {
          submitLoading.value = false
        })
      }
    }
  })
}
const handleCancel = () => {
  thisVisible.value = false
}

</script>

<template>
  <el-dialog v-model="thisVisible" class="w-[480px]" :title="data.id ? '重命名' : '新建项目'" :close-on-click-modal="false">
    <el-form class="w-full" ref="formRef" :model="formData" :rules="formRule" label-position="top"
      @submit.prevent="() => {}"
    >
      <el-form-item prop="name" :label="data.id ? '新的名称' : '项目名称'">
        <el-input ref="inputRef" :placeholder="data.id ? '请输入新的名称' : '请输入项目的名称'" v-model="formData.name"
          @keyup.enter="handleSubmit"
        ></el-input>
      </el-form-item>
      <el-form-item prop="type" label="类型" v-if="!data.id">
        <!-- <div class="w-full">
          <div class="flex items-center gap-3">
            <span>类型</span>
            <Tooltip class="" content="" />
          </div>
        </div> -->
        <el-radio-group v-model="formData.type" type="error" >
          <el-radio v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value"></el-radio>
        </el-radio-group>
      </el-form-item>
      <p>
      </p>
    </el-form>
    <template #footer>
      <div class="">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
