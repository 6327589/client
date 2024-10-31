<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: [Array, null],
    default: null,
  },
})

const emit = defineEmits(['update:modelValue', 'on-change'])

const innerValue = ref(props.modelValue === null ? null : [...props.modelValue])

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

const disabledDate = (date) => {
  const endOfDay = new Date(new Date().setHours(23, 59, 59, 999))
  return date.getTime() > endOfDay.getTime()
}

</script>

<template>
  <el-date-picker
    class="!w-full"
    v-model="innerValue"
    type="daterange"
    :disabled-date="disabledDate"
    value-format="YYYY-MM-DD"
    range-separator="-"
    start-placeholder="开始时间"
    end-placeholder="结束时间"
    />
</template>
