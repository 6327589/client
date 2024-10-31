<script setup>
import BotAvatar from '@/assets/icons/bot_avatar.svg'
import Tooltip from './Tooltip.vue'
import Markdown from './Markdown.vue'
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref, watch } from 'vue'
import { classnames, isJsonString, confirmExecHandle } from '@/utils'
import useBaseLocalStore from '@/stores/local'
import useWriteLocalStore from '@/stores/write'
import { listRecord, writePatentDraft, listPatentDraftChat, clearPatentDraftChat, deletePatentDraftChat } from '@/api/write'
import { useRoute } from 'vue-router'
import useCommonStore from '@/stores/common'

const emits = defineEmits([
  'on-update-answer',
])
const props = defineProps({
  type: String,
  currentMenu: Object,
})

const commonStore = useCommonStore()
const baseLocalStore = useBaseLocalStore()
const writeLocalStore = useWriteLocalStore()
const route = useRoute()

const draftId = Number(route.params.id)

const sessionBoxRef = ref(null)
const sessionList = ref([])
const getSessionList = async () => {
  const body = {
    draft_id: draftId,
    record_id: props.currentMenu.recordId,
  }
  const res = await listPatentDraftChat(body)
  let list = res.Data || []

  if (list.length === 0 && props.currentMenu.fieldId === 12) {
    sessionList.value = []
    // const regex = /根据权利要求\d+所述的系统，其特征在于/g
    const regex = /根据权利要求\s*\S+\s*其特征在于/g

    const arr = claimList.value.map(item => {
      const text = item.content.replace(regex, '作为优选方案')
      return text
    })
    const content = `下面我将给你一段专利代理师提供的该发明技术方案的内容，请你对不通顺的话进行润色，保证这些话是通顺的。请输出你处理完的结果，尽可能输出原文，不要扭曲原文的意思，也不要自己发挥
        你的回答中不要出现对自己身份的描述，请只输出润色完的结果，不要输出其他任何字符。
        # 下面正式开始：
        ## 该发明技术方案的内容：${arr.join('\n\n')}。`
    inputValue.value = content
    await handleSend(true)
  } else {
    list = list.map((x, i) => {
      return {
        id: x.ID,
        status: 'success',
        question: x.question,
        answer: x.answer,
        isPre: props.currentMenu.fieldId === 12 && i === 0,
      }
    })
    sessionList.value = list
  }
}

watch(() => props.currentMenu, val => {
  if (val) {
    getSessionList()
  } else {
    sessionList.value = []
  }
}, { immediate: true })

const inputValue = ref('')

const sendLoading = ref(false)

const updateAnswerValue = (id, value) => {
  const index = sessionList.value.findIndex(x => x.id === id)
  sessionList.value[index].answer = value
}
const updateAnswerStatus = (id, status) => {
  const index = sessionList.value.findIndex(x => x.id === id)
  sessionList.value[index].status = status
}
const handleSend = async (isPre = false) => {
  if (inputValue.value === '') {
    ElMessage.error('请输入您的想法！')
    return
  }
  if (props.currentMenu.min_word > 0 && inputValue.value.length < props.currentMenu.min_word) {
    ElMessage.error(`请输入不少于${props.currentMenu.min_word}字的内容！`)
    return
  }
  if (sendLoading.value) return

  sendLoading.value = true
  writeLocalStore.setSendLoading(true)

  const item = {
    id: 'id' + (sessionList.value.length ? sessionList.value[sessionList.value.length - 1].id + 1 : 1),
    question: inputValue.value,
    status: 'answering',
    answer: '...',
    isPre,
  }
  console.log('isPre', isPre)
  inputValue.value = ''
  sessionList.value.push(item)

  const body = {
    category: props.type,
    draft_id: draftId,
    field_id: props.currentMenu.fieldId,
    field_key: props.currentMenu.key,
    user_input: item.question,
    is_regenerate: isRegenerate.value,
    record_id: props.currentMenu.recordId,
  }

  try {
    const response = await writePatentDraft(body)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        sendLoading.value = false
        writeLocalStore.setSendLoading(false)
        scrollToEnd()
        break
      }
      const text = decoder.decode(value, { stream: true })
      const setResult = (data) => {
        if (data.code && data.code !== 0) {
          ElMessage.error(data.message)
          updateAnswerValue(item.id, '当前服务器超载，请点击“重新生成”或稍后再使用!')
          updateAnswerStatus(item.id, 'error')
        } else {
          if (data.content) {
            updateAnswerValue(item.id, data.content)
            scrollToEnd()
          }
          if (data.chat_id) {
            item.id = data.chat_id
            updateAnswerStatus(item.id, 'success')
          }
        }
      }
      if (isJsonString(text)) {
        setResult(JSON.parse(text))
      } else {
        const regex = /\{"content":\s*"[^"]*"\}/g
        const matches = text.match(regex)
        if (matches && matches.length) {
          matches.map(match => {
            if (isJsonString(match)) {
              setResult(JSON.parse(match))
            } else {
              console.error('error')
            }
          })
        }
      }
    }
  } catch (error) {
    sendLoading.value = false
    writeLocalStore.setSendLoading(false)
  }
}
const handleSend2 = async (item) => {
  if (sendLoading.value) return

  sendLoading.value = true
  writeLocalStore.setSendLoading(true)
  item.status = 'answering'
  item.answer = '...'

  const body = {
    category: props.type,
    draft_id: draftId,
    field_id: props.currentMenu.fieldId,
    field_key: props.currentMenu.key,
    user_input: item.question,
    is_regenerate: isRegenerate.value,
    record_id: props.currentMenu.recordId,
  }

  try {
    const response = await writePatentDraft(body)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        sendLoading.value = false
        writeLocalStore.setSendLoading(false)
        scrollToEnd()
        break
      }
      const text = decoder.decode(value, { stream: true })
      const setResult = (data) => {
        if (data.code && data.code !== 0) {
          ElMessage.error(data.message)
          updateAnswerValue(item.id, '当前服务器超载，请点击“重新生成”或稍后再使用!')
          updateAnswerStatus(item.id, 'error')
        } else {
          if (data.content) {
            updateAnswerValue(item.id, data.content)
            scrollToEnd()
          }
          if (data.chat_id) {
            item.id = data.chat_id
            updateAnswerStatus(item.id, 'success')
          }
        }
      }
      if (isJsonString(text)) {
        setResult(JSON.parse(text))
      } else {
        const regex = /\{"content":\s*"[^"]*"\}/g
        const matches = text.match(regex)
        if (matches && matches.length) {
          matches.map(match => {
            if (isJsonString(match)) {
              setResult(JSON.parse(match))
            } else {
              console.error('error')
            }
          })
        }
      }
    }
  } catch (error) {
    sendLoading.value = false
    writeLocalStore.setSendLoading(false)
  }
}
const scrollToEnd = () => {
  if (sessionBoxRef.value) {
    sessionBoxRef.value.scrollTop = sessionBoxRef.value.scrollHeight
  }
}

// 追加
const handleAnswerAdd = (answer) => {
  emits('on-update-answer', {
    action: 'add',
    answer,
  })
}
// 覆盖
const handleAnswerCover = async (answer) => {
  emits('on-update-answer', {
    action: 'cover',
    answer,
  })
}

const isRegenerate = ref(false)
const handleAnswerRefresh = async (item, index) => {
  if (item.status === 'error') {
    handleSend2(item)
  } else {
    // 删除原来的
    const body = {
      draft_id: draftId,
      chat_id: item.id,
    }
    await deletePatentDraftChat(body)
    sessionList.value.splice(index, 1)
    // 重新回答
    inputValue.value = item.question
    isRegenerate.value = true
    await handleSend()
    isRegenerate.value = false
  }
}
const handleDeleteHistoryItem = async (item, index) => {
  if (item.status === 'error') {
    sessionList.value.splice(index, 1)
  } else {
    const body = {
      draft_id: draftId,
      chat_id: item.id,
    }
    confirmExecHandle('提示', '确认删除当前记录吗？', () => {
      return deletePatentDraftChat(body).then((_) => {
        ElMessage.success('删除成功')
        sessionList.value.splice(index, 1)
      }).catch((_) => { })
    })
  }
}

const handleClearHistory = () => {
  const body = {
    draft_id: draftId,
    record_id: props.currentMenu.recordId,
  }
  confirmExecHandle('提示', '确认清除所有记录吗？', () => {
    return clearPatentDraftChat(body).then((_) => {
      ElMessage.success('清除成功')
      sessionList.value = []
    }).catch((_) => { })
  })
}

const isOpenClaim = ref(true)
const claimList = ref([])
const currentClaimId = ref(null)
const currentClaim = computed(() => {
  return claimList.value.find(x => x.id === currentClaimId.value)
})
const getClaimList = async () => {
  const recordRes = await listRecord({ category: 'claim', draft_id: draftId })
  const recordList = recordRes.Data || []
  const list = recordList.map(item => {
    return {
      id: item.ID,
      title: item.paragraph,
      content: item.content,
    }
  })
  claimList.value = list
}
onMounted(() => {
  if (props.type === 'description') {
    getClaimList()
  }
})

</script>

<template>
  <div class="flex-grow w-full flex flex-col overflow-hidden">
    <div class="flex-grow relative overflow-hidden">
      <div class="w-full h-full p-4 overflow-auto flex flex-col gap-2 " ref="sessionBoxRef">
        <!-- 第一条提示语 -->
        <div v-if="currentMenu && currentMenu.start_prompt" class="w-full flex items-start justify-start gap-3">
          <BotAvatar class="flex-none w-6 h-6" />
          <div :class="classnames('py-2 px-5 rounded-[20px] rounded-tl leading-1.4',
            'bg-[var(--el-fill-color-light)]',
          )">
            {{ currentMenu.start_prompt }}
          </div>
          <Tooltip class="" v-if="currentMenu.tip" :content="currentMenu.tip" />
        </div>

        <div v-for="(item, index) in sessionList" :key="item.id" :class="classnames('',
        )">
          <!-- question -->
          <div v-if="item.question && !item.isPre" class="flex items-end justify-end gap-3 pl-9">
            <div :class="classnames('py-2 px-5 rounded-[20px] rounded-br leading-1.4 whitespace-pre-line',
              'bg-[var(--el-color-primary)] text-white',
            )">
              {{ item.question }}
            </div>
            <img class="flex-none w-6 h-6 rounded-full" :src="baseLocalStore.userInfo.avatar" alt="">
          </div>

          <!-- answer -->
          <div v-if="item.answer" class="w-full pr-9 mt-2">
            <div class="w-full flex items-start justify-start gap-3">
              <BotAvatar class="flex-none w-6 h-6" />
              <div :class="classnames('py-2 px-5 rounded-[20px] rounded-tl leading-1.4',
                'bg-[var(--el-fill-color-light)]',
              )">
                <span v-if="item.status === 'error'" class="text-red-500">{{ item.answer }}</span>
                <Markdown v-else :content="item.answer" />
              </div>
              <Tooltip class="h-20" v-if="item.tip" :content="item.tip" />
            </div>
            <div v-if="item.answer && item.question" :class="classnames('flex items-center gap-1 pl-9 mt-1',
              // sendLoading && item.id === sessionList[sessionList.length - 1].id && 'opacity-0 pointer-events-none',
              // sendLoading && item.id !== sessionList[sessionList.length - 1].id && 'opacity-60 pointer-events-none',
              sendLoading && item.status === 'answering' && 'opacity-0 pointer-events-none',
              sendLoading && item.status !== 'answering' && 'opacity-60 pointer-events-none',
            )">
              <el-tooltip v-if="item.status !== 'error'" effect="dark" content="追加" placement="top">
                <div class="w-8 h-8 rounded flex items-center justify-center cursor-pointer
                  hover:bg-[var(--el-fill-color)]
                " @click="handleAnswerAdd(item.answer)">
                  <el-icon>
                    <CirclePlus />
                  </el-icon>
                </div>
              </el-tooltip>
              <el-tooltip v-if="item.status !== 'error'" effect="dark" content="覆盖" placement="top">
                <div class="w-8 h-8 rounded flex items-center justify-center cursor-pointer
                  hover:bg-[var(--el-fill-color)]
                " @click="handleAnswerCover(item.answer)">
                  <el-icon>
                    <DocumentChecked />
                  </el-icon>
                </div>
              </el-tooltip>
              <el-tooltip v-if="!item.isPre && index === sessionList.length - 1" effect="dark" content="重新回答" placement="top">
                <div class="w-8 h-8 rounded flex items-center justify-center cursor-pointer
                  hover:bg-[var(--el-fill-color)]
                " @click="handleAnswerRefresh(item, index)">
                  <el-icon>
                    <Refresh />
                  </el-icon>
                </div>
              </el-tooltip>
              <el-tooltip v-if="!item.isPre" effect="dark" content="删除" placement="top">
                <div class="w-8 h-8 rounded flex items-center justify-center cursor-pointer
                  hover:bg-[var(--el-fill-color)]
                " @click="handleDeleteHistoryItem(item, index)">
                  <el-icon>
                    <Delete />
                  </el-icon>
                </div>
              </el-tooltip>
            </div>
          </div>

        </div>
      </div>

      <!-- 权利要求预览 -->
      <div v-if="type === 'description'" class="w-full z-10 pr-4 pl-11 absolute left-0 bottom-0">
        <div :class="classnames('w-full bg-[var(--el-fill-color-light)] border-t border-x rounded-t-[20px]',
          // isOpenClaim && 'pb-4',
        )">
          <div class="w-full p-4 flex items-center justify-center gap-2 cursor-pointer" @click="() => isOpenClaim = !isOpenClaim">
            <el-icon :class="classnames('transition-transform',
              !isOpenClaim ? 'rotate-180' : 'rotate-0'
            )">
              <ArrowDown />
            </el-icon>
            预览权利要求
          </div>
          <div :class="classnames('w-ful',
            isOpenClaim ? 'p-4 h-auto overflow-auto' : 'h-0 overflow-hidden'
          )">
            <div v-if="currentClaim" class="bg-white p-4">
              <div class="w-full flex items-center justify-between">
                <h1>{{ currentClaim.title }}</h1>
                <el-button type="primary" plain @click="() => currentClaimId = null">查看其他权利要求</el-button>
              </div>
              <Markdown :content="currentClaim.content" />
            </div>
            <div v-else class="w-full flex flex-wrap gap-3">
              <div v-for="item in claimList" :key="item.id"
                class="bg-white px-4 py-2 border border-light rounded-md cursor-pointer"
                @click="() => currentClaimId = item.id"
              >
                {{ item.title }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="flex-none p-4 border-t flex items-center gap-4">
      <el-tooltip effect="dark" content="清空记录" placement="top">
        <el-button class="h-8 !px-2" @click="handleClearHistory">
          <el-icon :size="16">
            <Delete :ref="(el) => commonStore.setTourList(el, 3, '请点击此按钮对不满意内容进行清除')" />
          </el-icon>
        </el-button>
      </el-tooltip>
      <el-input class="w-full" type="textarea" :autosize="{minRows: 1, maxRows: 6}" v-model="inputValue" :disabled="sendLoading" placeholder="请输入您的想法"
        :ref="(el) => commonStore.setTourList(el, 1, '请在这里输入您的想法')">
        <template #suffix>
          <el-icon class="w-6 h-6 cursor-pointer" @click="handleSend(false)">
            <Promotion v-if="!sendLoading" class="text-xl text-[var(--el-color-primary)]"
              :ref="(el) => commonStore.setTourList(el, 2, '请点击此按钮进行生成')"
            />
            <Loading v-else class="animate-spin text-xl text-[var(--el-color-primary)]" />
          </el-icon>
        </template>
      </el-input>
      <el-button type="primary" @click="handleSend(false)">
        <el-icon class="w-6 h-6 cursor-pointer">
          <Promotion v-if="!sendLoading" class="text-xl "
            :ref="(el) => commonStore.setTourList(el, 2, '请点击此按钮进行生成')" />
          <Loading v-else class="animate-spin text-xl " />
        </el-icon>
      </el-button>
    </div>

  </div>
</template>
<style lang="scss" scoped>
.el-textarea {
  --el-input-bg-color: var(--el-fill-color-light);
}
</style>
