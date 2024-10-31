<script setup>
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { addPatentDraft, renamePatentDraft } from '@/api/write'
import Tooltip from '../components/Tooltip.vue'

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
  type: [1, 11],
})
const formRule = {
  name: [
    { required: true, type: 'string', message: '请输入名称', trigger: 'blur' },
  ],
  type: [
    { required: true, type: 'array', message: '请选择领域', trigger: 'change' },
  ],
}

const typeList = [
  {
    label: '信息技术领域',
    value: 1,
    children: [
      { label: '人工智能', value: 11 },
      { label: '计算机软件和硬件技术', value: 12, disabled: true },
      { label: '通信技术（如5G通信等）', value: 13, disabled: true },
      { label: '大数据', value: 14, disabled: true },
      { label: '区块链', value: 15, disabled: true },
      { label: '半导体集成电路', value: 16, disabled: true },
      { label: '其他', value: 17, disabled: true },
    ],

  },
  {
    label: '生命科学领域',
    value: 2,
    children: [
      { label: '生物医药：如药物研发（化学药、生物药、中药等）、制药工艺和技术。', value: 21, disabled: true },
      { label: '生物技术：基因工程、细胞工程、蛋白质工程 、生物芯片等。', value: 22, disabled: true },
      { label: '医疗技术和器械：各类检测设备、治疗设备、手术器械等。', value: 23, disabled: true },
      { label: '其他', value: 24, disabled: true },
    ],
  },
  {
    label: '工程技术领域',
    value: 3,
    children: [
      { label: '机械工程：各类机械设备、机械制造工艺等。', value: 31, disabled: true },
      { label: '电气工程：发电、输变电、电机、电器等。', value: 32, disabled: true },
      { label: '土木工程：建筑结构、建筑材料、桥梁道路等。', value: 33, disabled: true },
      { label: '化学工程：化工流程、化工设备、材料合成等。', value: 34, disabled: true },
      { label: '其他', value: 35, disabled: true },
    ],
  },
  {
    label: '能源与环保领域',
    value: 4,
    children: [
      { label: '新能源：太阳能、风能、水能、核能、氢能等新能源开发利用技术。', value: 41, disabled: true },
      { label: '传统能源改进：如煤炭清洁利用等。', value: 42, disabled: true },
      { label: '环境保护技术：污水处理、大气污染治理、固废处理等。', value: 43, disabled: true },
      { label: '其他', value: 44, disabled: true },
    ],
  },
  {
    label: '材料科学领域',
    value: 5,
    children: [
      { label: '金属材料：各类特种合金等。', value: 51, disabled: true },
      { label: '无机非金属材料：如新型陶瓷等。', value: 52, disabled: true },
      { label: '高分子材料：各类合成树脂、塑料、橡胶等。', value: 53, disabled: true },
      { label: '复合材料 。', value: 54, disabled: true },
      { label: '其他', value: 55, disabled: true },
    ],
  },
  {
    label: '其他领域',
    value: 6,
    disabled: true,
  },
]

const submitLoading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      if (!props.data.id) {
        const body = {
          draft_type: 'interaction',
          title: formData.value.name,
        }
        addPatentDraft(body).then(res => {
          ElMessage.success('新建成功')
          handleCancel()
          emits('editSuccess')
        }).finally(() => {
          submitLoading.value = false
        })
      } else {
        const body = {
          draft_id: props.data.id,
          new_title: formData.value.name,
        }
        renamePatentDraft(body).then(res => {
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
      <el-form-item prop="type" label="">
        <div class="w-full">
          <div class="flex items-center gap-3">
            <span>技术领域</span>
            <!-- <Tooltip class="" content="注：目前仅支持人工智能、图像处理领域，敬请期待更多领域。" /> -->
            <Tooltip class="" content="注：目前仅支持人工智能领域，敬请期待更多领域。" />
          </div>
          <el-cascader class="w-full" v-model="formData.type" :options="typeList" />
        </div>
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
