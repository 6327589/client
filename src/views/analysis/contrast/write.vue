<script setup>
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import { getImgUrl } from '@/utils'
import useCommonStore from '@/stores/common'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
const router = useRouter()
const commonStore = useCommonStore()
const formData = ref({
  claims: [{ id: 0, content: '' }],
  field: '',
  question: '',
  effect: '',
})

const handleAddClaim = () => {
  const length = formData.value.claims.length
  formData.value.claims.push({
    id: length,
    content: '',
  })
}

const handleDeleteClaim = (id) => {
  const index = formData.value.claims.findIndex(item => item.id === id)
  formData.value.claims.splice(index, 1)
}

const handleSave = () => {
  const list = commonStore.contrastQueue
  const length = commonStore.contrastQueue.length
  if (list.length >= 2) {
    ElMessage({
      type: 'warning',
      message: '对比列已满',
    })
  } else {
    list.push({ type: 'write', content: formData.value, id: length })
    commonStore.setContrastQueue(list)
    router.push({ name: 'Analysis_Contrast' })
  }
}
</script>
<template>
    <div class="w-full h-full bg-white overflow-auto">
        <div class="w-[800px] max-h-full py-5 mx-auto ">
            <div class="mb-6">
                <h2>权利要求（技术方案）</h2>
                <p class="text-[#909399]">建议输入一段你的技术方案，使用我们最先进的算法来帮助你查询专利的新颖性，以此更好的评估您专利的潜在价值</p>
                <div class=" border-[1px] border-[#E4E7ED] p-4 rounded-[4px]">
                    <div v-for="(item, index) in formData.claims" :key="item.id"
                        class="group h-25 bg-[#F5F7FA] flex p-4 mb-3 relative rounded-[4px]">
                        <img :src="getImgUrl('close.png')" class="absolute -top-2 -right-2 hidden group-hover:block"
                            @click="handleDeleteClaim(item.id)">
                        <h3 class="w-20 m-2">权利要求{{ index + 1 }}</h3>
                        <el-input class="w-[646px] text-xs" type="textarea" :autosize="{ minRows: 2 }"
                            v-model="item.content" placeholder="建议输入：您的专利方案是什么，面向的额技术领域是什么，解决了什么技术问题，达到了什么预期效果？" />
                    </div>
                    <el-button :icon="Plus" class="font-semibold" @click="handleAddClaim">新增权利要求</el-button>
                </div>
            </div>
            <div class="mb-6">
                <h2 class="mb-1">技术领域</h2>
                <el-input class="text-xs" type="textarea" :autosize="{ minRows: 3 }" v-model="formData.field"
                    placeholder="建议输入：您的专利方案是什么，面向的额技术领域是什么，解决了什么技术问题，达到了什么预期效果？" />
            </div>
            <div class="mb-6">
                <h2 class="mb-1">所解决的技术问题</h2>
                <el-input class="text-xs" type="textarea" :autosize="{ minRows: 3 }" v-model="formData.question"
                    placeholder="建议输入：您的专利方案是什么，面向的额技术领域是什么，解决了什么技术问题，达到了什么预期效果？" />
            </div>
            <div class="mb-6">
                <h2 class="mb-1">预期效果</h2>
                <el-input class="text-xs" type="textarea" :autosize="{ minRows: 3 }" v-model="formData.effect"
                    placeholder="建议输入：您的专利方案是什么，面向的额技术领域是什么，解决了什么技术问题，达到了什么预期效果？" />
            </div>
            <el-button type="primary" @click="handleSave">对比查看</el-button>
        </div>
    </div>
</template>
