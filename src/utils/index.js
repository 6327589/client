import * as filterConst from '@/filter/const'
import formatFunc from '@/filter/format'
import config from '@/config'
import { ElMessageBox } from 'element-plus'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export const classnames = (...classes) => {
  return twMerge(clsx(...classes))
}

export const consoleJson = (obj) => {
  console.log(JSON.stringify(obj, null, 2))
}
export const isJsonString = (str) => {
  try {
    JSON.parse(str)
    return true
  } catch (e) {
    return false
  }
}

/**
 * filter过滤器 优先选择项目中的过滤器
 * @param {String} filterName 过滤器名称
 * @param {String} arg 参数
 * @return {String|Number} 转换结果，一般结果为字符串或数字
 */
export const filter = (filterName, arg) => {
  const data = filterConst[`${filterName}Data`]
  if (data) {
    return data[arg] || data.default
  }
  return ''
}

/**
 * format格式化 优先执行项目中的方法
 * @param {String} formatName 过滤器名称
 * @param {Array} args 任意多个参数
 * @return {String|Number} 转换结果，一般结果为字符串或数字
 */
export const format = (formatName, ...args) => {
  return formatFunc[formatName] ? formatFunc[formatName](...args) : ''
}

/**
 * 将const中的数据转化为下拉框选择时可用的数组
 * @param {Object} obj  const中的数据
 * @param {Object|null} firstItem 下拉框第一项，如：{value: '', label: '请选择xxx'}
 * @param {Boolean} type key的类型
 * @return {Array} 转换后的数据
 */
export const constDataToArray = (obj, firstItem = null, type = 'string') => {
  const arr = []
  const typeMap = {
    string: k => ({ value: k, label: obj[k] }),
    number: k => ({ value: Number(k), label: obj[k] }),
    boolean: k => ({ value: k === 'true', label: obj[k] }),
  }

  Object.keys(obj).forEach(k => {
    if (k !== 'default') {
      arr.push(typeMap[type](k))
    }
  })
  if (firstItem) {
    arr.unshift(firstItem)
  }
  return arr
}

// 确认执行dialog
export const confirmExecHandle = (title, text, callback, cancelCallBack = null) => {
  return ElMessageBox.confirm(text, title, {
    type: 'warning',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true
        instance.confirmButtonText = '执行中...'
        instance.showClose = false
        instance.closeOnClickModal = false
        instance.closeOnPressEscape = false
        instance.showCancelButton = false

        callback().finally(() => {
          done()
          setTimeout(() => {
            instance.confirmButtonLoading = false
          }, 300)
        })
      } else {
        done()
        cancelCallBack?.()
      }
    },
  }).then(() => { // 在 beforeClose 中已经对then和catch后的事件做了处理，then可省略； 省略catch时，点击取消会提示错误
  }).catch(() => {
  })
}
// confirmExecHandle 使用示例：
// confirmExecHandle('提示', '此操作将删除xxx，是否继续？', () => {
//   return new Promise((resolve, reject) => {
//     setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
//   }).catch(_ => console.log('Oops errors!'))
// })

export const getImgUrl = (name) => {
  return `${config.baseUrl}images/${name}`
}

export const copy = (data) => JSON.parse(JSON.stringify(data))

/**
 * 异步延迟
 * @param {number} n 延迟时间 毫秒
 * @return {Promise}
 */
export const sleep = (s) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      return resolve('')
    }, s)
  })
}

// json数组排序
export const sortJson = (arr, key, order = 'asc') => {
  const compare = (a, b) => {
    if (a[key] < b[key]) return -1
    if (a[key] > b[key]) return 1
    return 0
  }
  const sortedArr = arr.sort((item1, item2) => {
    return order === 'asc' ? compare(item1, item2) : compare(item2, item1)
  })
  return sortedArr
}

// 无限极分类
export const unlimitedForLayer = (cate, pid = 0) => {
  const arr = []
  cate.forEach(x => {
    if (x.pid === pid) {
      x.children = unlimitedForLayer(cate, x.id)
      arr.push(x)
    }
  })
  return arr
}
export const getParents = (cate, id) => {
  let arr = []
  for (const element of cate) {
    const x = element
    if (x.id === id) {
      arr = [...getParents(cate, x.pid), x]
      break
    }
  }
  return arr
}
