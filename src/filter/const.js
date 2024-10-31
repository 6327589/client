/*
 * @Descripttion: 过滤器数据
 *
 * 通过filter()方法转换
  * eg: filter('cardType', 0) 结果为身份证
 */

// 证件类型
export const cardTypeData = {
  0: '身份证',
  1: '护照',
  2: '军人身份证',
  6: '社会保障卡',
  A: '武装警察身份证',
  B: '港澳通行证',
  C: '台湾居民来往大陆通行证',
  E: '户口簿',
  F: '临时身份证',
  P: '外国人永久居留证',
  default: '',
}

// 性别
export const sexData = {
  0: '女',
  1: '男',
  default: '保密',
}

// 员工状态
export const employeeStatusData = {
  normal: '正常',
  disable: '已禁用',
  default: '',
}
export const employeeStatusTypeData = {
  normal: '',
  disable: 'danger',
}

// 性别
export const genderData = {
  0: '未知',
  1: '男',
  2: '女',
  default: '',
}
export const genderTypeData = {
  0: 'info',
  1: '',
  2: 'danger',
}

export const userStatusData = {
  0: '禁用',
  1: '正常',
  default: '',
}
export const userStatusTypeData = {
  0: 'danger',
  1: '',
  default: '',
}
export const searchFieldTypeData = {
  text: '文本',
  number: '号码',
  date: '日期',
  addr: '地址',
}

export const searchFieldDataTypeData = {
  发明公开: '发明',
  发明授权: '发明',
  实用新型: '实用新型',
  外观设计: '外观设计',
}
export const searchFieldDataTypeTagTypeData = {
  发明公开: 'primary',
  发明授权: 'primary',
  实用新型: 'success',
  外观设计: 'info',
}
export const searchFieldDataTypeValueData = {
  发明: ['发明公开', '发明授权'],
  实用新型: ['实用新型'],
  外观设计: ['外观设计'],
  default: [],
}

export const searchFieldDataLegalStatusData = {
  有效专利: '有效',
  无效专利: '失效',
  失效专利: '失效',
  公开: '待定',
  实质审查: '待定',
}
export const searchFieldDataLegalStatusTagTypeData = {
  有效专利: 'primary',
  无效专利: 'danger',
  失效专利: 'danger',
  公开: 'warning',
  实质审查: 'warning',
}
export const searchFieldDataLegalStatusValueData = {
  有效: ['有效专利'],
  失效: ['无效专利', '失效专利'],
  待定: ['公开', '实质审查'],
  default: [],
}

export const searchFieldDataCurrentStatusTagTypeData = {
  驳回: 'danger',
  撤回: 'danger',
  公开: 'warning',
  权利终止: 'danger',
  实质审查: 'warning',
  授权: 'primary',
  default: 'info',
}

// 撰写类型
export const writeTypeData = {
  disclosure: '交互式撰写',
  interactive: '一键式撰写',
  default: '',
}
