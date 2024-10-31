<script setup>
import { classnames } from '@/utils'
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { getDirectionDraftFieldInfo, updateDirectionDraftField } from '@/api/write'
import { ElMessage } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import Image from './Image.vue'
import data from '@/router/modules/data'

const route = useRoute()

const draftId = Number(route.params.id)

const containerRef = ref(null)

const formData = ref({
  applicant: '', // 申请人
  inventor: '', // 发明人
  phone: '', // 联系电话
  patent_title: '', // 专利名称
  application_category: '发明', // 申请类别
  technical_field: '', // 技术领域
  scheme_introduction: '', // 背景技术方案介绍
  disadvantage: '', // 背景技术指出不足和缺点
  items: [
    {
      a: '',
      b: '',
      c: '',
    },
  ],
  explanation_drawing: '', // 附图说明
  images: [],
})

const formRef = ref(null)
const formRule = {
  patent_title: [
    { required: true, type: 'string', message: '请填写专利名称', trigger: 'blur' },
  ],
  application_category: [
    { required: true, type: 'string', message: '请选择申请类别', trigger: 'change' },
  ],
  technical_field: [
    { required: true, type: 'string', message: '请填写技术领域', trigger: 'change' },
  ],
  scheme_introduction: [
    { required: true, type: 'string', message: '请填写背景技术方案介绍', trigger: 'change' },
  ],
  disadvantage: [
    { required: true, type: 'string', message: '请填写背景技术不足和缺点', trigger: 'change' },
  ],
  requiredValue: [
    { required: true, type: 'string', message: '请填写内容', trigger: 'change' },
  ],
}

const pageLoading = ref(true)
const deleteSequences = ref([])
const getData = () => {
  getDirectionDraftFieldInfo({ draft_id: draftId }).then((res) => {
    console.log('detail1', res)
    formData.value = {
      applicant: res.data.cus_applicant,
      inventor: res.data.cus_inventor,
      phone: res.data.cus_phone,
      patent_title: res.data.cus_patent_title,
      application_category: res.data.cus_application_category || '发明',
      technical_field: res.data.cus_technical_field,
      scheme_introduction: res.data.cus_scheme_introduction,
      disadvantage: res.data.cus_disadvantage,
      items: res.supplement_data.map(x => {
        return {
          a: x.cus_technical_solution,
          b: x.cus_beneficial_effect,
          c: x.cus_specific_embodiment,
          sequence: x.sequence,
          opt: 'modify',
        }
      }),
      explanation_drawing: res.data.cus_explanation_drawing,
      images: JSON.parse(res.data.cus_attached_image || '[]'),
    }
    list2.value = res.supplement_data.map((x, i) => {
      return {
        opt: 'modify',
        children: [
          { id: 'a', label: '核心技术方案', required: true },
          { id: 'b', label: '有益效果', required: true },
          { id: 'c', label: '具体实施方案', required: true },
        ],
      }
    })
  }).finally(() => {
    pageLoading.value = false
  })
}

onMounted(() => {
  getData()
})
const list1 = [
  { id: 'form1', label: '申请人', required: false },
  { id: 'form2', label: '发明人', required: false },
  { id: 'form3', label: '联系电话', required: false },
  { id: 'form4', label: '专利名称', required: true },
  { id: 'form5', label: '申请类型', required: true },
  { id: 'form6', label: '技术领域', required: true },
  { id: 'form7', label: '背景技术介绍', required: true },
  { id: 'form8', label: '背景技术缺陷', required: true },

]
const list2 = ref([
  {
    opt: 'modify',
    children: [
      { id: 'a', label: '核心技术方案', required: true },
      { id: 'b', label: '有益效果', required: true },
      { id: 'c', label: '具体实施方案', required: true },
    ],
  },
])
const list3 = [
  { id: 'form9', label: '附图说明', required: false },
  { id: 'form10', label: '附图', required: false },
]

const handleAddItem = () => {
  list2.value.push({
    children: [
      { id: 'a', label: '核心技术方案', required: true },
      { id: 'b', label: '有益效果', required: true },
      { id: 'c', label: '具体实施方案', required: true },
    ],
  })

  formData.value.items.push({
    a: '',
    b: '',
    c: '',
    opt: 'create',
  })
}
const handleDeleteItem = (index) => {
  const formItem = formData.value.items[index]
  list2.value.splice(index, 1)
  formData.value.items.splice(index, 1)
  if (formItem.sequence) {
    deleteSequences.value.push(formItem.sequence)
  }
}

const imageRef = ref(null)

const getFormData = () => {
  const imgList = imageRef.value.getListData()
  let supplement = formData.value.items.map((x, i) => {
    return {
      cus_technical_solution: x.a,
      cus_beneficial_effect: x.b,
      cus_specific_embodiment: x.c,
      sequence: x.sequence,
      opt: x.opt,
    }
  })
  const deleteList = deleteSequences.value.map(x => {
    return {
      sequence: x,
      opt: 'delete',
    }
  })
  supplement = [...supplement, ...deleteList]
  const body = {
    draft_id: draftId,
    data: {
      cus_applicant: formData.value.applicant, // 申请人
      cus_inventor: formData.value.inventor, // 发明人
      cus_phone: formData.value.phone, // 联系电话
      cus_patent_title: formData.value.patent_title, // 专利名称
      cus_application_category: formData.value.application_category, // 申请类别
      cus_technical_field: formData.value.technical_field, // 技术领域
      cus_scheme_introduction: formData.value.scheme_introduction, // 背景技术方案介绍
      cus_disadvantage: formData.value.disadvantage, // 背景技术指出不足和缺点
      cus_explanation_drawing: formData.value.explanation_drawing, // 附图说明
      cus_attached_image: JSON.stringify(imgList), // 附图
    },
    supplement_data: supplement,
  }
  return body
}
const saveApi = () => {
  const data = getFormData()
  return updateDirectionDraftField(data)
}

const submitApi = () => {
  return new Promise((resolve, reject) => {
    formRef.value.validate((valid) => {
      if (valid) {
        saveApi().then(() => {
          const data = getFormData()
          resolve(data)
        }).catch(() => {
          reject(new Error('error'))
        })
      } else {
        ElMessage.error('请填写完整信息')
        reject(new Error('error'))
      }
    })
  })
}

defineExpose({
  saveApi,
  submitApi,
})

</script>

<template>
  <div class="w-full h-full flex bg-white rounded border border-light py-4 overflow-hidden">
    <!-- left -->
    <el-anchor class="flex-none h-full w-[180px] overflow-auto scroll-content"
      :container="containerRef" direction="vertical" type="underline" :offset="5"
    >

      <el-anchor-link
        v-for="(item, i) in list1" :key="i"
        :href="'#' + item.id"
        :class="classnames('h-10 flex items-center cursor-pointer relative')"
      >
        <span v-if="item.required" class="text-[#F56C6C]">*</span>
        {{ item.label }}
      </el-anchor-link>

      <div class="w-full flex flex-col gap-2">
        <div v-for="(item, index) in list2" :key="item.id"
          :class="classnames('w-full pl-3 pr-2',
            item.opt === 'delete' ? 'hidden' : ''
          )">
          <div class="w-full border border-dashed rounded-lg relative">
            <el-anchor-link
              v-for="(child, i) in item.children" :key="i"
              :href="`#form20_${index + 1}_${child.id}`"
              :class="classnames('h-10 flex childs-center cursor-pointer relative')"
            >
              <span v-if="child.required" class="text-[#F56C6C]">*</span>
              {{ child.label + (index + 1) }}
            </el-anchor-link>

            <div class="absolute top-0 right-0" v-if="index > 0">
              <el-button type="danger" link size="small" :icon="Delete" circle
                @click="handleDeleteItem(index)"
              />
            </div>
          </div>
        </div>

        <div class="w-full flex justify-center py-2">
          <el-button type="primary" size="small" :icon="Plus" circle
            @click="handleAddItem"
          />
        </div>
      </div>

      <el-anchor-link
        v-for="(item, i) in list3" :key="i"
        :href="'#' + item.id"
        :class="classnames('h-10 flex items-center cursor-pointer relative')"
      >
        <span v-if="item.required" class="text-[#F56C6C]">*</span>
        {{ item.label }}
      </el-anchor-link>

    </el-anchor>

    <!-- right -->
    <div class="flex-grow h-full p-4 pt-6 overflow-auto flex flex-col gap-5 scroll-content
      pb-[100vh]
    "
      ref="containerRef"
    >
      <el-form class="w-full" ref="formRef" :model="formData" :rules="formRule"
      >
        <el-form-item prop="applicant" id="form1">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              01
            </div>
            <p class="flex-grow font-medium">申请人</p>
          </div>
          <el-input placeholder="请填写申请人" v-model="formData.applicant"></el-input>
        </el-form-item>
        <el-form-item prop="inventor" id="form2">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              02
            </div>
            <p class="flex-grow font-medium">发明人</p>
          </div>
          <el-input placeholder="请填写发明人" v-model="formData.inventor"></el-input>
        </el-form-item>
        <el-form-item prop="phone" id="form3">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              03
            </div>
            <p class="flex-grow font-medium">联系电话</p>
          </div>
          <el-input placeholder="请填写联系电话" v-model="formData.phone"></el-input>
        </el-form-item>
        <el-form-item prop="patent_title" id="form4">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              04
            </div>
            <p class="flex-grow font-medium">专利名称</p>
          </div>
          <el-input placeholder="专利名称" v-model="formData.patent_title"></el-input>
        </el-form-item>
        <el-form-item prop="application_category" id="form5">
          <div class="w-full flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              05
            </div>
            <p class="flex-grow font-medium">申请类别</p>
          </div>
          <el-radio-group v-model="formData.application_category">
            <el-radio label="发明" value="发明"></el-radio>
            <el-radio label="实用新型" value="实用新型"></el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="technical_field" id="form6">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              06
            </div>
            <p class="flex-grow font-medium">技术领域</p>
          </div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="技术领域" v-model="formData.technical_field"></el-input>
        </el-form-item>
        <el-form-item prop="scheme_introduction" id="form7">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              07
            </div>
            <p class="flex-grow font-medium">背景技术介绍<span class="opacity-70">（与本专利最接近的现有技术。）</span></p>
          </div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="例如：
高ISO数的图像在生成时通常会伴随着噪声的产生，去除噪声是用以提高图像的清晰度的常用手段。授权公告号为CN***B 的中国发明专利提供了一种去除图像噪声的方法，是使用平均滤波器来去除图像噪声。平均滤波器能通过对局部区域进行平均化处理，降低图像的变化幅度，从而达到提高图像清晰度的目的。"
            v-model="formData.scheme_introduction"></el-input>
        </el-form-item>
        <el-form-item prop="disadvantage" id="form8">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              08
            </div>
            <p class="flex-grow font-medium">背景技术缺陷</p>
          </div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="背景技术缺陷" v-model="formData.disadvantage"></el-input>
        </el-form-item>

        <div
          v-for="(item, i) in formData.items" :key="i"
          :class="classnames('w-full',
            item.opt === 'delete' ? 'hidden' : ''
          )"
        >
          <el-form-item :id="'form20_' + (i+1) + '_a'" :prop="'items.' + i + '.a'" :rules="formRule.requiredValue">
            <div class="flex items-center gap-1">
              <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
                {{ (i + 9 + '').padStart(2, '0') }}
              </div>
              <p class="flex-grow font-medium">核心技术方案{{ i+1 }}</p>
            </div>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="item.a" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :id="'form20_' + (i+1) + '_b'" :prop="'items.' + i + '.b'" :rules="formRule.requiredValue">
            <div class="flex items-center gap-1">
              <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
                {{ (i + 9 + '').padStart(2, '0') }}
              </div>
              <p class="flex-grow font-medium">有益效果{{ i+1 }}</p>
            </div>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="item.b" placeholder=""></el-input>
          </el-form-item>
          <el-form-item :id="'form20_' + (i+1) + '_c'" :prop="'items.' + i + '.c'" :rules="formRule.requiredValue">
            <div class="flex items-center gap-1">
              <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
                {{ (i + 9 + '').padStart(2, '0') }}
              </div>
              <p class="flex-grow font-medium">具体实施方案{{ i+1 }}</p>
            </div>
            <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" v-model="item.c" placeholder=""></el-input>
          </el-form-item>
        </div>

        <el-form-item prop="phone" id="form9">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              {{ (formData.items.length + 9 + '').padStart(2, '0') }}
            </div>
            <p class="flex-grow font-medium">附图说明</p>
          </div>
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 10 }" placeholder="附图说明" v-model="formData.explanation_drawing"></el-input>
        </el-form-item>

        <el-form-item prop="phone" id="form10">
          <div class="flex items-center gap-1">
            <div class="flex-none w-5 h-5 flex items-center justify-center custom-bg-index text-white font-semibold text-xs">
              {{ (formData.items.length + 10 + '').padStart(2, '0') }}
            </div>
            <p class="flex-grow font-medium">附图</p>
          </div>
          <Image
            ref="imageRef"
            :list="formData.images"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.el-anchor) {
  height: 100%;

  .el-anchor__link {
    text-align: center;
    font-size: .875rem;
    color: #303133;
    line-height: 2.375rem;
  }

  .is-active {
    color: var(--el-anchor-active-color);
  }

  &.el-anchor--vertical.el-anchor--underline {
    &::before {
      left: unset;
      right: 0;
    }

    .el-anchor__marker {
      width: .1875rem;
      height: 2.375rem;
    }
  }

  &.el-anchor--vertical {
    .el-anchor__list {
      padding-left: 0;
    }

    .el-anchor__marker {
      left: unset;
      right: 0;
    }
  }
}

.scroll-content::-webkit-scrollbar {
  width: 0;
}

</style>
