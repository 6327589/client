<script setup>
const props = defineProps({
  type: String,
  description: String,
})
</script>

<template>
  <el-alert
    title="结论和建议"
    :type="props.type"
    :description="props.description"
    show-icon
    :closable="false" />
</template>

<style lang="scss" scoped>
.el-alert {
  --el-color-success: #256b07;
  --el-color-success-light-3: #669751;
  --el-color-success-light-5: #92b583;
  --el-color-success-light-7: #bed3b5;
  --el-color-success-light-8: #d3e1cd;
  --el-color-success-light-9: #e9f0e6;
  --el-color-success-dark-2: #1e5606;
  --el-alert-title-with-description-font-size: 18px;
}
:deep(.el-alert__title) {
    font-weight: 600;
}
</style>
