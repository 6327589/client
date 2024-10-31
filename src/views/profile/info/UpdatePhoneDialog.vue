<script setup>
import { ref, watch } from 'vue'
import { regExpPhone } from 'utils/validate'
import { ElMessage } from 'element-plus'
import { sendUpdatePhoneCode, updatePhone } from '@/api'
import useBaseLocalStore from '@/stores/local'

const emits = defineEmits(['update:visible'])
const props = defineProps({
  visible: Boolean,
})

const baseLocalStore = useBaseLocalStore()

const thisVisible = ref(false)

watch(() => props.visible, val => {
  if (val) {
    thisVisible.value = val
  } else {
    formRef.value.resetFields()
  }
})
watch(thisVisible, val => {
  emits('update:visible', val)
})

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
      sendUpdatePhoneCode(data).then(res => {
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
      updatePhone(body).then(res => {
        ElMessage.success('修改手机号码成功')
        baseLocalStore.updateUserInfoItems({
          phone: body.phone,
        })
        handleCancel()
      }).finally(() => {
        submitLoading.value = false
      })
    }
  })
}
const handleCancel = () => {
  thisVisible.value = false
}
</script>

<template>
  <el-dialog v-model="thisVisible" class="w-[480px]" title="修改手机号" :close-on-click-modal="false">
    <el-form class="w-full" ref="formRef" :model="formData" :rules="formRule">
      <el-form-item prop="phone">
        <el-input size="large" placeholder="请输入新手机号" v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <div class="w-full flex items-center gap-4">
          <el-input size="large" class="flex-grow" placeholder="请输入验证码" v-model="formData.code"></el-input>
          <el-button size="large" class="w-[200px]" :disabled="isSendCode" @click="handleSendCode">{{ !isSendCode ? sendCodeText : sendCodeTime + 's后重新发送'}}</el-button>
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="">
        <el-button @click="handleCancel">
          取消
        </el-button>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
