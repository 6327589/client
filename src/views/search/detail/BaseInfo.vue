<script setup>
import { ref } from 'vue'

const props = defineProps({
  detail: Object,
})

</script>

<template>
  <div class="w-full p-6">
    <!-- <h1 class="text-black text-xl">基本信息</h1> -->
    <div class="mt-6 w-full flex flex-col gap-5">
      <div class="flex">
        <div class="w-[120px]">申请号：</div>
        <div class="flex-grow">{{ detail.application_number }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">申请日：</div>
        <div class="flex-grow">{{ detail.application_date }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">公开公告号：</div>
        <div class="flex-grow">{{ detail.document_number }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">公开公告日：</div>
        <div class="flex-grow">{{ detail.document_date }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">申请人：</div>
        <div class="flex-grow">{{ detail.applicant }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">申请号：</div>
        <div class="flex-grow">{{ detail.application_number }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">发明人：</div>
        <div class="flex-grow">{{ detail.inventor }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px]">IPC分类号：</div>
        <div class="flex-grow">{{ detail.ipc }}</div>
      </div>
      <div class="flex">
        <div class="w-[120px] flex-none">摘要：</div>
        <div class="flex-grow whitespace-pre-line" v-html="detail.abstract"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(em) {
  font-style: normal;
  // color: #6d3dcc;
  background: #ffbaba;
}
</style>
