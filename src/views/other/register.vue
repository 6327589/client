<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter, RouterLink } from 'vue-router'
import { getImgUrl } from '@/utils'
import Logo from '@/assets/icons/logo.svg'
import { sendRegisterCode, registerByPhone } from '@/api'
import { regExpPhone } from 'utils/validate'
import useBaseLocalStore from '@/stores/local'

const baseLocalStore = useBaseLocalStore()
const router = useRouter()

const formRef = ref(null)
const formData = ref({
  phone: '',
  code: '',
})
const formRule = {
  phone: [
    { required: true, type: 'string', message: '请输入手机号', trigger: 'blur' },
    { pattern: regExpPhone, message: '请输入正确的手机号码', trigger: 'change' },
  ],
  code: [
    { required: true, type: 'string', message: '请输入验证码', trigger: 'blur' },
    { pattern: /^\d{6}$/, message: '验证码为6位数字', trigger: 'change' },
  ],
}

const sendCodeStartTime = 60
const sendCodeTime = ref(sendCodeStartTime)
const sendCodeText = ref('发送验证码')
const isSendCode = ref(false)
const handleSendCode = async () => {
  formRef.value.validateField(['phone'], (valid) => {
    if (valid) {
      const data = {
        phone: formData.value.phone,
      }
      sendCodeText.value = '重新发送'
      sendCodeTime.value = sendCodeStartTime
      isSendCode.value = true
      sendRegisterCode(data).then(res => {
        ElMessage.success('验证码发送成功，请在手机短信中查看')
        const timer = setInterval(() => {
          sendCodeTime.value--
          if (sendCodeTime.value <= 0) {
            isSendCode.value = false
            clearInterval(timer)
          }
        }, 1000)
      }).catch(_ => {
        isSendCode.value = false
      })
    }
  })
}

const submitLoading = ref(false)
const handleSubmit = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      submitLoading.value = true
      const body = {
        phone: formData.value.phone,
        phone_code: formData.value.code,
      }
      registerByPhone(body).then(res => {
        ElMessage.success('注册成功')
        baseLocalStore.setLogin(res)

        router.push({ name: 'Search' })
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}

</script>

<template>
  <div class="w-screen h-screen flex flex-col" style="background: linear-gradient(110.94deg, #fdfffc 14.07%, #ecf6ea 92.42%);">
    <!-- header -->
    <div class="flex-none w-full h-12 flex items-center justify-between px-4">
      <router-link :to="{name: 'Home'}" class="flex items-center gap-1">
        <Logo class="w-6 h-6" />
        <span class="text-base font-semibold ">蒙图未来专利助手</span>
      </router-link>
    </div>

    <!-- content -->
    <div class="flex-grow container mx-auto flex items-center">
      <div class="w-1/2 flex items-center justify-center">
        <div class="w-[400px]">
          <h1 class="text-black text-[36px] font-semibold">欢迎注册</h1>
          <div class="mt-6 flex items-center gap-10">
            <div class="py-2 font-semibold relative cursor-pointer text-[var(--el-color-primary)]"
            >
              手机注册
              <div class="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--el-color-primary)]"></div>
            </div>
          </div>
          <el-form class="w-full mt-8" ref="formRef" :model="formData" :rules="formRule">
            <el-form-item prop="phone">
              <el-input size="large" placeholder="请输入手机号" v-model="formData.phone"></el-input>
            </el-form-item>
            <el-form-item prop="code">
              <div class="w-full flex items-center gap-4">
                <el-input size="large" class="flex-grow" placeholder="请输入验证码" v-model="formData.code"></el-input>
                <el-button size="large" class="w-[200px]" :disabled="isSendCode" @click="handleSendCode">{{ !isSendCode ? sendCodeText : sendCodeTime + 's后重新发送'}}</el-button>
              </div>
            </el-form-item>
            <el-form-item class="mt-11">
              <el-button class="w-full" size="large" type="primary" @click="handleSubmit" :loading="submitLoading">注册</el-button>
            </el-form-item>
            <div class="mt-6 w-full">
              <span>已有账号，</span>
              <router-link  to="/login" class="cursor-pointer hover:underline text-[var(--el-color-primary)]">去登录</router-link>
            </div>

          </el-form>
        </div>
      </div>
      <div class="w-1/2">
        <img :src="getImgUrl('main.png')" class="w-full h-full object-contain" alt="register" />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
</style>
