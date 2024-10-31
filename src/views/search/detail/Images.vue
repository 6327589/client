<script setup>

defineProps({
  list: {
    type: Array,
    default: () => [],
  },
})

</script>

<template>
  <div class="w-full h-full p-6">
    <div v-if="list.length" class="w-full flex flex-col gap-5">
      <div v-for="(item, i) in list" :key="i"
        class="w-full"
      >
        <el-image class="w-full border-2"
          :src="item"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="list"
          :initial-index="i"
          fit="cover"
        />
      </div>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">

      <el-empty />
    </div>
  </div>
</template>
