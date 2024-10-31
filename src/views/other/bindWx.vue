<script setup>
import { bindWx } from '@/api'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import useBaseLocalStore from '@/stores/local'

const route = useRoute()
const router = useRouter()
const baseLocalStore = useBaseLocalStore()

const handleBind = async (code) => {
  try {
    const res = await bindWx({ code })
    console.log('res', res)
    ElMessage.success('绑定成功')
    baseLocalStore.updateUserInfoItems({
      bindWechat: true,
    })
    router.push({ name: 'Profile_Info' })
  } catch (e) {
    // 绑定失败后，更新参数
    router.push({ name: 'Profile_Info' })
  }
}

onMounted(() => {
  const { code, state } = route.query
  if (code && state) {
    handleBind(code)
  }
})

</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-center mb-[15px] text-xl">绑定微信</h1>
    </div>
  </div>
</template>
