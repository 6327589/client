<script setup>
import { getImgUrl } from '@/utils'
import HomeTitle from '@/assets/svgs/home_title.svg'
import Header from '../layout/Header.vue'
import Footer from './components/Footer.vue'

</script>

<template>
  <div class="w-screen min-h-screen flex flex-col"
    style="background: linear-gradient(110.94deg, #fdfffc 14.07%, #ecf6ea 92.42%);">
    <!-- header -->
    <Header />

    <!-- content -->
    <div class="flex-grow container mx-auto h-full flex">
      <div class="w-1/2 flex items-center">
        <div>
          <HomeTitle />
          <router-link :to="{ name: 'Login' }">
            <el-button class="mt-12 inline-flex" type="primary" size="large">立即体验</el-button>
          </router-link>
        </div>
      </div>
      <div class="w-1/2">
        <img :src="getImgUrl('main.png')" class="w-full h-full object-contain" alt="register" />
      </div>
    </div>

    <!-- footer -->
    <Footer />

  </div>
</template>
<style lang="scss"></style>
