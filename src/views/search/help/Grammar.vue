<script setup>
const tableData = [
  {
    char: 'AND运算符：表示“与”运算，用来连接两个或多个检索条件，检索结果必须同时满足所有条件。',
    example: 'TIT:(半导体) AND TIT:(导电性)',
    decription: '表示您想要检索的专利，其标题中必须同时包含“半导体”和“导电性”这两个关键词。'
  },
  {
    char: 'OR运算符：表示“或”运算，用来连接两个检索条件，检索结果可以满足任一条件。',
    example: 'TIT:(半导体) OR TIT:(导电性)',
    decription: '表示您想要检索的专利，其标题中可以包含“半导体”或“导电性”这两个关键词中的任意一个。'
  },
  {
    char: 'NOT 运算符：表示“非”运算，用来排除包含特定条件的检索结果。',
    example: 'TIT:(半导体) AND NOT TIT:(导电性)',
    decription: '表示您想要检索的专利，其标题中包含“半导体”一词，但同时不包含“导电性”。'
  }
]
</script>
<template>
  <div class="w-full p-5 flex-grow flex flex-col overflow-hidden">
    <el-table :data="tableData" border style="width: 100%" class="flex-grow overflow-auto">
      <el-table-column prop="char" label="符号" min-width="70" />
      <el-table-column prop="example" label="示例" min-width="60" />
      <el-table-column prop="decription" label="说明" min-width="30" />
    </el-table>
  </div>
</template>
<style scoped lang="scss">
:deep(.el-table th.el-table__cell) {
  background-color: #fafafa;
}
</style>