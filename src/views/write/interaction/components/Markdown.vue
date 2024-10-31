<script setup>
import { marked } from 'marked'
import { computed, watch, onMounted, ref } from 'vue'

const props = defineProps({
  content: String,
})

const TypeSet = async function (elements) {
  if (!window.MathJax) {
    return
  }
  window.MathJax.startup.promise = window.MathJax.startup.promise
    .then(() => {
      return window.MathJax.typesetPromise(elements)
    })
    .then(() => {
      contentDom.value.innerHTML = marked.parse(contentDom.value.innerHTML)
    })
    .catch((err) => console.log('Typeset failed: ' + err.message))
  return window.MathJax.startup.promise
}

onMounted(() => {
  TypeSet([contentDom.value])
})
const contentDom = ref(null)
watch(() => props.content,
  () => {
    TypeSet([contentDom.value])
  },
)
</script>

<template>
  <div class="w-full text-[var(--el-text-color-regular)]" v-html="props.content" ref="contentDom"></div>
  <!-- <div class="whitespace-pre-line">
    {{ content }}
  </div> -->
</template>
