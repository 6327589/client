<script setup>
import { ref, onMounted, onUpdated, nextTick } from 'vue'

const inputText = ref('This is [red]red[/red] and this is [blue]blue[/blue]')

const updateText = (event) => {
  console.log('event', event.target.innerHTML)
  inputText.value = event.target.innerHTML
}

onMounted(() => {
  const el = document.querySelector('.editable-div')
  el.innerHTML = inputText.value
    .replace(/\[red\](.*?)\[\/red\]/g, '<span style="color: red;">$1</span>')
    .replace(/\[blue\](.*?)\[\/blue\]/g, '<span style="color: blue;">$1</span>')
})

onUpdated(() => {
  nextTick(() => {
    const el = document.querySelector('.editable-div')
    const selection = window.getSelection()
    const range = document.createRange()
    range.selectNodeContents(el)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
  })
})
</script>

<template>
  <div
    v-colored-input="inputText"
    contenteditable
    @input="updateText"
    class="editable-div"
  ></div>
</template>

<style scoped>
.editable-div {
  border: 1px solid #ccc;
  padding: 5px;
  min-height: 20px;
}
</style>
