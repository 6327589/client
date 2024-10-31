<script setup>
import { bindWx } from 'api'
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const route = useRoute()
const router = useRouter()

const handleChangeWx = async (code) => {
  try {
    await bindWx({ code })
    ElMessage.success('换绑成功')
    router.push({ name: 'Profile_Info' })
  } catch (e) {
    router.push({ name: 'Profile_Info' })
  }
}

onMounted(() => {
  const { code, state } = route.query
  if (code && state) {
    handleChangeWx(code)
  }
})

</script>

<template>
  <div class="w-screen h-screen flex flex-col items-center justify-center">
    <div class="flex flex-col items-center justify-center">
      <h1 class="text-center mb-[15px] text-xl">换绑微信</h1>
    </div>
  </div>
</template>
