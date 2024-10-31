<script setup>
import { ref, onMounted } from 'vue'
import { getDirectionDraftClaimInfo } from '@/api/write'

const props = defineProps({
  draftId: {
    type: Number,
    default: 0,
  },
  disclosureData: {
    type: Object,
    default: () => ({}),
  },
})

const list = ref([])

const getData = async () => {
  const apis = props.disclosureData.supplement_data.map(x => {
    return getDirectionDraftClaimInfo({
      draft_id: props.draftId,
      remake: 0, // 0-正常，1-重新生成
      sequence: x.sequence,
    })
  })
  const res = await Promise.all(apis)
  console.log('res', res)
}

onMounted(() => {
  getData()
  console.log('Step1 mounted')
})
</script>

<template>
  <div class="w-full h-full py-6 px-4 flex flex-col">
    <div class="flex-none w-full pb-4 flex items-center justify-between">
      <h1 class="font-medium">发明名称</h1>
      <div class="flex items-center">
        <el-button class="" link>
          <el-icon><EditPen/></el-icon>
          <span class="ml-2">编辑</span>
        </el-button>
        <el-button class="" link>
          <el-icon><Refresh/></el-icon>
          <span class="ml-2">重新回答</span>
        </el-button>
      </div>
    </div>

    <div class="flex-grow w-full overflow-auto pt-4 flex flex-col gap-5">
      <div v-for="(item, i) in list" :key="i"
        class="w-full"
      >

      </div>

    </div>
  </div>
</template>
