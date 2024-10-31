<script setup>
import { classnames, copy } from '@/utils'
import { onMounted, ref, watch } from 'vue'
import Sortable from 'sortablejs'

const props = defineProps({
  list: Array,
})

const currentList = ref([])
const realList = ref([])
const indexList = ref([])
const start = ref(0)

const handleAddImage = () => {
  const id = start.value++
  realList.value.push({
    id,
    url: '',
    desc: '',
  })

  indexList.value.push({
    id,
  })
}

const sortBoxRef = ref(null)

const init = (list) => {
  currentList.value = list.map((x, i) => {
    x.id = i
    return x
  })
  start.value = currentList.value.length
  indexList.value = Array.from({ length: currentList.value.length }, (v, i) => {
    return { id: i }
  })

  console.log('xxx', currentList.value, indexList.value)

  Sortable.create(sortBoxRef.value, {
    // group: {
    //   name: 'stage-list',
    //   pull: false,
    // },
    handle: '.sortable-stage-handle',
    animation: 500,
    ghostClass: 'stage-sortable-ghost-class',
    fallbackClass: 'stage-sortable-fallback-class',
    forceFallback: true,
    onStart (evt) {
      // this.stageIsDragging = true
    },
    onEnd (evt) {
      // this.stageIsDragging = false
    },
    onUpdate (e) {
      const { oldIndex, newIndex } = e
      console.log('index', e, oldIndex, newIndex)

      // 重新排序数据
      const movedItem = indexList.value.splice(oldIndex, 1)[0]
      indexList.value.splice(newIndex, 0, movedItem)

      console.log(indexList, indexList.value)
    },
  })
}

onMounted(() => {
  realList.value = copy(props.list)
})

watch(() => realList.value.length, (val) => {
  const list = []
  indexList.value.forEach((x, i) => {
    const item = currentList.value.find(y => y.id === x.id)
    list.push(item)
  })
  init(list)
})

const handleDelete = (item, index) => {
  currentList.value.splice(index, 1)

  // console.log('delete', index, id)
  // const index2 = indexList.value.findIndex(x => x.id === id)
  // indexList.value.splice(index2, 1)
}

const getListData = () => {
  console.log('indexList.value', currentList.value)
  const list = []
  indexList.value.forEach((x, i) => {
    const item = currentList.value.find(y => y.id === x.id)
    list.push(item)
  })
  return list
}

defineExpose({
  getListData,
})
</script>

<template>
  <div class="w-full py-2">
    <div class="w-full flex flex-col gap-5 stage-list"
      ref="sortBoxRef"
    >
      <div v-for="(item, i) in currentList" :key="i"
        :class="classnames('w-full flex gap-6 sortable-stage-handle',
        )"
      >
        <el-image class="flex-none w-30 h-30 select-none"
          :src="item.url"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          :preview-src-list="[item.url]"
          fit="cover"
        />
        <el-input class="flex-grow" type="textarea" :autosize="{ minRows: 2, maxRows: 5 }" placeholder="附图说明" v-model="item.desc"></el-input>
        <div class="h-full flex items-center justify-center">
          <el-button type="danger" size="small" @click="handleDelete(item)">
            {{ item.id }}
            <el-icon><Delete/></el-icon>
          </el-button>
        </div>
      </div>
    </div>

    <div class="mt-6 w-full border border-dashed py-6 flex items-center justify-center rounded-xl gap-4 cursor-pointer"
      @click="handleAddImage"
    >
      <el-icon size="24"><Plus /></el-icon>
      添加附图
    </div>
  </div>

</template>

<style lang="scss" scoped>
.stage-list{
  .stage-sortable-ghost-class{
    border: 1px dashed #000 !important;;
    opacity: 0.3;
  }
  .stage-sortable-fallback-class{
    transform-origin: 0 0;
    transform: rotate(2deg);
    box-shadow: 0 0 30px 5px #9a9898 !important;
  }
  .task-sortable-ghost-class{
    border: 1px dashed #000 !important;
    opacity: 0.3;
  }
  .task-sortable-fallback-class{
    transform-origin: 0 0;
    transform: rotate(2deg);
    box-shadow: 0 0 30px 5px #9a9898 !important;
  }
}
</style>
