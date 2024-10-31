<script setup>
const tableData = [
  {
    country: '中国(CN)',
    number: '公开(公告)号',
    type: '实用新型',
    composition: ['CN88112345A', 'CN1123456A', 'CN112345678A'],
    example: [
      'CN[2位年份][1位类型号][5位流水号][标识代码]（1985-1988）',
      'CN[1位类型号][6位流水号][标识代码]（1989-2007.8.22）',
      'CN[1位类型号][8位流水号][标识代码]（2007.8.29起）'
    ],
    explanation: [
      {
        label: '类型号:',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '标识代码（1985-1992）:',
        data: [
          {
            key: 'A',
            value: '发明公开'
          },
          {
            key: 'B',
            value: '发明审定'
          },
          {
            key: 'U',
            value: '实用新型公告'
          },
          {
            key: 'S',
            value: '外观设计公告'
          }
        ]
      },
      {
        label: '标识代码（1993-2010.3）:',
        data: [
          {
            key: 'A',
            value: '发明公开'
          },
          {
            key: 'B',
            value: '国防解密发明授权（2005.4-2010.3）'
          },
          {
            key: 'C',
            value: '发明授权'
          },
          {
            key: 'Y',
            value: '实用新型公告'
          },
          {
            key: 'D',
            value: '外观设计公告'
          },
        ]
      },
      {
        label: '标识代码（2010.4起）:',
        data: [
          {
            key: 'A',
            value: '发明公开'
          },
          {
            key: 'B',
            value: '发明授权'
          },
          {
            key: 'U',
            value: '实用新型公告'
          },
          {
            key: 'S',
            value: '外观设计公告'
          }
        ]
      },
    ]
  },
  {
    country: '中国(CN)',
    number: '公开(公告)号',
    type: '发明授权',
    composition: ['CN88112345A', 'CN1123456A', 'CN112345678A', 'CN1123456A'],
    example: [
      'CN[2位年份][1位类型号][5位流水号][标识代码]（1985 - 1988）',
      'CN[1位类型号][6位流水号][标识代码]（1989 - 2007.8.22）',
      'CN[1位类型号][8位流水号][标识代码] （2007.8.29起）',
      'CN[1位类型号][6位流水号][标识代码]（2010.4起）'
    ],
    explanation: [
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
    ]
  },
  {
    country: '中国(CN)',
    number: '公开(公告)号',
    type: '外观设计',
    composition: ['CN88112345A', 'CN1123456A', 'CN112345678A'],
    example: [
      'CN[2位年份][1位类型号][5位流水号][标识代码]（1985 - 1988）',
      'CN[1位类型号][6位流水号][标识代码]（1989 - 2007.8.22）',
      'CN[1位类型号][8位流水号][标识代码]（2007.8.29起）'
    ],
    explanation: [
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
    ]
  },
  {
    country: '中国(CN)',
    number: '公开(公告)号',
    type: '发明申请',
    composition: ['CN88112345A', 'CN1123456A', 'CN112345678A'],
    example: [
      'CN[2位年份][1位类型号][5位流水号][标识代码]（1985 - 1988）',
      'CN[1位类型号][6位流水号][标识代码]（1989 ~2007.7.11）',
      'CN[1位类型号][8位流水号][标识代码]（2007.7.18起）'
    ],
    explanation: [
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
      {
        label: '类型号',
        data: [
          {
            key: '1',
            value: '发明'
          },
          {
            key: '2',
            value: '实用新型'
          },
          {
            key: '3',
            value: '外观设计'
          }]
      },
    ]
  },
  {
    country: '中国(CN)',
    number: '申请号',
    type: '',
    composition: ['CN88112345', 'CN03112345.X', 'CN200311234567.X'],
    example: [
      'CN[2位年份][1位类型号][5位流水号]（1985 - 1988）',
      'CN[2位年份][1位类型号][5位流水号].[校验位]（1989 - 2003.9.30）',
      'CN[4位年份][1位类型号][7位流水号].[校验位]（2003.10.01起'
    ],
    explanation: [
      {
        label: '类型号:',
        data: [
          {
            key: '1',
            value: '发明专利申请；'
          },
          {
            key: '2',
            value: '实用新型专利申请；'
          },
          {
            key: '3',
            value: '外观设计专利申请；'
          },
          {
            key: '8',
            value: '进入中国国家阶段的PCT发明专利申请；'
          },
          {
            key: '9',
            value: '进入中国国家阶段的PCT 实用新型专利申请。'
          },
          {
            key: '',
            value: '“.”后面的为校验位，可以为1位数字（0-9），或字母x。'
          }
        ]
      },
    ]
  },
]
const arraySpanMethod = ({ row, column, rowIndex, columnIndex }) => {
  if (columnIndex === 0) {
    if (rowIndex === 0) return [5, 1]
    else return [0, 1]
  }
  if (columnIndex === 1) {
    if (rowIndex === 0) return [4, 1]
    else if (rowIndex === 4) return [1, 1]
    else return [0, 1]
  }
  if (columnIndex === 5) {
    if (rowIndex === 0) return [4, 1]
    else if (rowIndex === 4) return [1, 1]
    else return [0, 1]
  }
}
</script>

<template>
  <div class="flex-grow w-full flex flex-col p-5 overflow-hidden">
    <el-table :data="tableData" :span-method="arraySpanMethod" border style="width: 100%"
      class="flex-grow overflow-auto">
      <el-table-column prop="country" label="国家" min-width="30" />
      <el-table-column prop="number" label="号码" min-width="30" />
      <el-table-column prop="type" label="类型" min-width="30" />
      <el-table-column prop="example" label="样例" min-width="50">
        <template #default="{ row }">
          <div v-for="(score, index) in row.example" :key="index">
            {{ score }}
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="composition" label="号码组成" min-width="50">
        <template #default="{ row }">
          <div v-for="(score, index) in row.composition" :key="index">
            {{ score }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="文献代码释义" min-width="50">
        <template #default="{ row }">
          <div v-for="(score, index) in row.explanation" :key="index">
            {{ score.label }}
            <div v-for="item in score.data">
              <span>{{ `${item.key}${item.key ? ': ' : ''}` }} </span>
              <span>{{ item.value }}</span>
            </div>
            <br>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style scoped lang="scss">
:deep(.el-table th.el-table__cell) {
  background-color: #fafafa;
}
</style>