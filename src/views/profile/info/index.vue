<script setup>
import { onMounted, ref } from 'vue'
import { classnames } from '@/utils'
import WxIcon from '@/assets/icons/wx.svg'
import UpdatePhoneDialog from './UpdatePhoneDialog.vue'
import BindWxDialog from './BindWxDialog.vue'
import useBaseLocalStore from '@/stores/local'
import UploadOneImage from '@/components/upload/OneImage.vue'
import { updateProfileInfo } from '@/api'
import { ElMessage } from 'element-plus'

const baseLocalStore = useBaseLocalStore()

const formData = ref({
  name: baseLocalStore.userInfo.name,
  avatar: baseLocalStore.userInfo.avatar,
})

const updatePhoneVisible = ref(false)
const bindWxVisible = ref(false)

const uploadAvatarSuccess = (val) => {
  formData.value.avatar = val.url
}

onMounted(() => {
  // getProfileInfo().then(res => {
  //   console.log('getProfileInfo', res)
  // })
})

const submitBtnLoading = ref(false)
const handleSubmit = async () => {
  try {
    const body = {
      avatar_url: formData.value.avatar,
      new_name: formData.value.name,
    }
    submitBtnLoading.value = true
    await updateProfileInfo(body)
    baseLocalStore.updateUserInfoItems({
      name: formData.value.name,
      avatar: formData.value.avatar,
    })
    ElMessage.success('修改成功')
    submitBtnLoading.value = false
  } catch (_) {
    submitBtnLoading.value = false
  }
}

</script>

<template>
  <div class="w-full h-full p-6 overflow-auto">
    <div class="w-full p-8 bg-white">
      <h1 class="text-xl font-semibold text-black">
        我的信息
      </h1>
      <div class="mt-6 flex items-center gap-4">
        <img class="w-20 h-20 rounded-full overflow-hidden" :src="formData.avatar" alt="">
        <upload-one-image select-type="button" title="修改头像"
          @on-change="uploadAvatarSuccess"
        />
      </div>
      <el-form class="mt-6 flex flex-wrap gap-x-6 w-[600px]" label-position="top">
        <el-form-item class="w-[260px]" label="用户名">
          <el-input v-model="formData.name" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item class="w-[260px]" label="账号ID">
          <el-input v-model="baseLocalStore.userInfo.uid" disabled ></el-input>
        </el-form-item>
        <el-form-item class="w-[260px]" label="手机号">
          <el-input v-model="baseLocalStore.userInfo.phone" :maxlength="11" disabled></el-input>
          <div class="absolute top-0 right-4 font-medium text-[var(--el-color-primary)] cursor-pointer" @click="updatePhoneVisible = true">
            修改手机号
          </div>
        </el-form-item>
        <el-form-item class="w-[260px]" label="注册时间">
          <el-input v-model="baseLocalStore.userInfo.createdAt" disabled></el-input>
        </el-form-item>
      </el-form>

      <h1 class="mt-8 text-xl font-semibold text-black">
        绑定账号
      </h1>
      <div class="mt-6 flex items-center gap-4">
        <WxIcon :class="classnames(
            baseLocalStore.userInfo.bindWechat ? 'text-[#50B674]' : 'text-[#A8ABB2]',
          )"
        />
        <el-button class="" @click="bindWxVisible = true"> {{ baseLocalStore.userInfo.bindWechat ? '换绑微信' : '绑定微信' }}</el-button>
      </div>

      <el-button class="mt-8 w-40" type="primary" :loading="submitBtnLoading" @click="handleSubmit">保存</el-button>
    </div>
  </div>

  <update-phone-dialog v-model:visible="updatePhoneVisible" />
  <bind-wx-dialog v-model:visible="bindWxVisible" :type="baseLocalStore.userInfo.bindWechat ? 'changeWx' : 'bindWx'" />

</template>
