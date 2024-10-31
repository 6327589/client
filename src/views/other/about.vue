<script setup>
import Header from '../layout/Header.vue'
import Footer from './components/Footer.vue'

</script>

<template>
  <div class="w-screen h-screen flex flex-col" style="background: linear-gradient(110.94deg, #fdfffc 14.07%, #ecf6ea 92.42%);">
    <!-- header -->
    <Header />

    <!-- content -->
    <div class="flex-grow w-full">
      <div class="container mx-auto h-full flex items-center justify-center">
        关于我们
      </div>
    </div>

    <!-- footer -->
    <Footer />
  </div>
</template>
<style lang="scss">
</style>
