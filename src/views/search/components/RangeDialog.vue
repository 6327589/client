<script setup>
import { ref, watch } from 'vue'
import { copy } from '@/utils'
import useSearchLocalStore from '@/stores/search'

const emits = defineEmits(['update:visible'])
const props = defineProps({
  visible: Boolean,
})

const searchLocalStore = useSearchLocalStore()

const thisVisible = ref(false)

watch(() => props.visible, val => {
  if (val !== thisVisible.value) {
    thisVisible.value = val
    if (val) {
      initData()
    }
  }
}, { immediate: true })
watch(thisVisible, val => {
  emits('update:visible', val)
})

const formData = ref({
  type: [],
  country: [],
})

const initData = () => {
  formData.value = {
    country_code: searchLocalStore.searchFrom.country_code,
    type: searchLocalStore.searchFrom.type,
  }
}

const submitLoading = ref(false)
const handleSubmit = () => {
  searchLocalStore.setSearchFromItems({
    country_code: formData.value.country_code,
    type: formData.value.type,
  })
  handleCancel()
}
const handleCancel = () => {
  thisVisible.value = false
}

const typeList = [
  { label: '发明', value: '发明' }, // 发明公开 + 发明授权
  { label: '实用新型', value: '实用新型' },
  { label: '外观设计', value: '外观设计' },
]
const countryList = [
  { label: '🇨🇳 中国（CN）', value: 'CN' },
]

</script>

<template>
  <el-dialog v-model="thisVisible" class="w-[480px] range-dialog" title="搜索范围设定" :close-on-click-modal="false">
    <el-form class="w-full" :model="formData" label-position="top">
      <el-form-item label="公开类型">
        <el-checkbox-group
          v-model="formData.type"
        >
          <el-checkbox v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <!-- <el-form-item label="国家地区">
        <el-checkbox-group
          v-model="formData.country_code"
        >
          <el-checkbox v-for="item in countryList" :key="item.value" :label="item.label" :value="item.value">
            {{ item.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
    </el-form>
    <template #footer>
      <div class="">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          保存
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.range-dialog{
  width: 500px;
  .el-dialog__title{
    font-weight: 700;
  }
}
</style>
