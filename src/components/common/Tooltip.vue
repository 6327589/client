<script setup>
const props = defineProps({
  title: String,
  content: String,
})
</script>

<template>
  <el-popover
    popper-class="tip-popover"
    placement="bottom"
    :title="props.title"
    trigger="hover"
    :content="content"
  >
    <template #reference>
      <el-icon :size="16" class="text-[var(--el-color-primary)] self-center"><InfoFilled /></el-icon>
    </template>
  </el-popover>
</template>

<style lang="scss">
.tip-popover {
  width: auto !important;
  max-width: 600px;
}
</style>
