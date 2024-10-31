<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: Array,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['update:modelValue', 'on-change'])

const innerValue = ref([...props.modelValue])

// 监听外部值的变化，并更新内部状态
watch(() => props.modelValue, (newValue) => {
  if (newValue !== innerValue.value) {
    innerValue.value = [...newValue]
  }
})

// 监听内部值的变化，并向父组件发出更新事件
watch(innerValue, (newValue) => {
  if (newValue !== props.modelValue) {
    emit('update:modelValue', newValue)
    emit('on-change', newValue)
  }
})

</script>

<template>
  <el-checkbox-group v-model="innerValue" :disabled="disabled">
    <el-checkbox v-for="child in items" :key="child.value" :label="child.label" :value="child.value"
      class="w-full mr-0 text-[var(--el-text-color-regular)]"
    >
    <div class="w-full flex items-center justify-between">
      <span class="font-medium">{{ child.label }}</span>
    </div>
    </el-checkbox>
  </el-checkbox-group>
</template>
