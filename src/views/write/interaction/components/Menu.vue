<script setup>
import { ref } from 'vue'
import BotAvatar from '@/assets/icons/bot_avatar.svg'
import { classnames } from '@/utils'
import Tooltip from './Tooltip.vue'
import useCommonStore from '@/stores/common'

const emits = defineEmits([
  'on-add-record',
  'on-select-record',
])
const props = defineProps({
  type: String,
  list: Array,
  currentMenu: Object,
})

const commonStore = useCommonStore()

const isOpen = ref(true)

const selectRecord = (item) => {
  emits('on-select-record', item)
}

const handleAddItem = async () => {
  emits('on-add-record')
}

</script>

<template>
  <div class="flex-none max-h-[50%] w-full flex gap-3 p-4 overflow-hidden">
    <BotAvatar class="flex-none w-6 h-6" />
    <div class="flex-grow h-full flex flex-col bg-[var(--el-fill-color-light)] p-4 rounded-[20px] rounded-tl">
      <div class="flex items-center gap-2">
        <h1 class="flex-none text-[28px] font-medium leading-1">Hi，欢迎使用AI专利助手</h1>
        <Tooltip class="" content="为了保证更好的辅助撰写效果，所有模块内容请认真撰写。" />
      </div>
      <p class="flex-none mt-1 text-[var(--el-text-color-secondary)]">你可以回答以下问题</p>
      <div class="flex-grow mt-2 w-full grid grid-cols-2 gap-2 overflow-auto">
        <div v-for="(item, index) in list" :key="item.id" :class="classnames(`
            border border-light p-4 rounded-2xl bg-white cursor-pointer
            w-full
            hover:border-[var(--el-color-primary)]
          `,
          currentMenu && currentMenu.pid === item.pid ? 'border-[var(--el-color-primary)]' : '',
          (isOpen || index < 1) ? 'block' : 'hidden',
        )" @click="selectRecord(item)"
          :ref="(el) => commonStore.setTourList(el, 4 + index, `请点击这里进行${item.label}撰写`)">
          <div class="w-full flex items-center gap-1">
            <div
              class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              {{ item.index }}</div>
            <p class="flex-grow font-medium">{{ item.label }}</p>
          </div>
          <div v-if="item.items" class="w-full mt-2.5 flex flex-wrap items-center gap-2">
            <el-button type="primary" size="small" class="text-xs !ml-0" v-for="(item2, i) in item.items" :key="i"
              :plain="item2.id !== currentMenu?.id" @click.stop="selectRecord(item2)"
            >
              {{ item2.label }}
            </el-button>
          </div>
        </div>

        <div v-if="type === 'claim' || type === 'description'" class="w-[160px] min-h-14 flex items-center justify-center border rounded-2xl border-dashed bg-white cursor-pointer group
          hover:border-[var(--el-color-primary)]
        " @click="handleAddItem" :ref="(el) => commonStore.setTourList(el, 4, '请点击这里进行下一条权利要求的辅助撰写')">
          <el-icon class="text-[var(--el-text-color-secondary)] group-hover:text-[var(--el-color-primary)]" :size="30">
            <Plus />
          </el-icon>
        </div>

      </div>
      <div class="flex-none w-full pt-2 h-6 flex items-center justify-center cursor-pointer" @click="isOpen = !isOpen">
        <el-icon :class="classnames('transition-transform',
          isOpen ? 'rotate-180' : 'rotate-0'
        )">
          <ArrowDown />
        </el-icon>
      </div>
    </div>
  </div>
</template>
