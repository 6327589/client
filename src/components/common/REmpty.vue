<script setup>
import { getImgUrl } from '@/utils'

const props = defineProps({
  noImage: {
    type: Boolean,
    default: false,
  },
  width: Number,
})
</script>

<template>
  <div class="r-empty flex items-center justify-center">
    <img class="r-empty-img" :style="`width: ${props.width}px`" :src="getImgUrl('nodata.png')" v-if="!props.noImage" title="">
    <div class="r-empty-text">
      <slot>暂无数据</slot>
    </div>
  </div>
</template>

<style lang="scss">
// 请保证父组件有定位
.r-empty {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
  padding: 20px;

  &-img {
    width: 100px;
    margin-bottom: 10px;
  }

  &-text {
    font-size: 14px;
    line-height: 2em;
    color: #a3a3a3;
  }
}
</style>
