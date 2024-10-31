<script setup>
const props = defineProps({
  detail: Object,
})
</script>

<template>
  <div class="whitespace-pre-line p-6" v-html="detail.claims">
  </div>
</template>

<style lang="scss" scoped>
:deep(em) {
  font-style: normal;
  // color: #6d3dcc;
  background: #ffbaba;
}
</style>
