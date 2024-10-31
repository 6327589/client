<script setup>
import TipIcon from '@/assets/icons/tip.svg'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { ref, onMounted, watch, computed } from 'vue'
import { sortJson } from 'utils'
import useCommonStore from '@/stores/common'
import useBaseLocalStore from '@/stores/local'
import useWriteLocalStore from '@/stores/write'
import { updateProfileInfo } from '@/api'

const commonStore = useCommonStore()
const writeLocalStore = useWriteLocalStore()
const route = useRoute()
const baseLocalStore = useBaseLocalStore()
const props = defineProps({
})
const handleSetIsWritten = async () => {
  try {
    const body = {
      is_write_draft: true,
      new_name: baseLocalStore.userInfo.name,
      avatar: baseLocalStore.userInfo.avatar,
    }
    await updateProfileInfo(body)
    baseLocalStore.updateUserInfoItems({
      is_write_draft: true,
    })
  } catch (_) {
  }
}
onMounted(() => {
  if (!baseLocalStore.userInfo.is_write_draft) {
    const leadList = writeLocalStore.isLeadedList
    if (!leadList.includes(route.name)) {
      isTipShow.value = true
      leadList.push(route.name)
      if (leadList.length === 4) {
        handleSetIsWritten()
      }
      writeLocalStore.setIsLeadedList(leadList)
    }
  }
})
const isTipShow = ref(false)
const handleShowTips = () => {
  isTipShow.value = true
}
const tourList = computed(() => {
  let list = sortJson(commonStore.tourList, 'id', 'asc')
  list = list.map((item, index) => {
    return {
      ...item,
    }
  })
  return list
})

const currentStep = ref(0)
const nextBtnName = computed(() => {
  let name = ''
  if (currentStep.value === tourList.value.length - 1) {
    name = '完成'
  } else {
    name = '下一步'
  }
  return name
})

</script>

<template>
    <div class="h-full flex justify-center items-center cursor-pointer px-5 mr-5" @click="handleShowTips">
      <TipIcon class="w-6 h-6"></TipIcon>
      <span class="text-xs font-bold">操作助手</span>
    </div>

    <el-tour v-model="isTipShow" :show-close="false">
        <el-tour-step v-for="item in tourList" :key="item.id"
            :target="item.element.$el ? item.element.$el : item.element" :description="item.description" placement="top"
            :prev-button-props="{
                children: '上一步',
                onClick: () => currentStep -= 1
            }" :next-button-props="{
                children: nextBtnName,
                onClick: () => currentStep = currentStep === tourList.length - 1 ? 0 : currentStep + 1
            }" />

        <template #indicators>
            <span class="mx-4">{{ currentStep + 1 }} / {{ tourList.length }}</span>
            <el-button size="small" @click="() => {
                isTipShow = false
                currentStep = 0
            }" type="primary" plain>已知晓，不再提醒</el-button>
        </template>
    </el-tour>
</template>
