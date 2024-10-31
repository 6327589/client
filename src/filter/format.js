/*
 * @Descripttion: 格式化方法
 *
 * 通过format()方法转换
 * eg: format('date', new Date()) 结果为当前日期
 */
import dayjs from 'dayjs'
// import { timeAgo } from 'utils'

export default {
  /** *************** 时间相关 *************** **/
  month: t => {
    if (!t) return ''
    return dayjs(t).format('YYYY-MM')
  },
  date: t => {
    if (!t) return ''
    return dayjs(t).format('YYYY-MM-DD')
  },
  minute: t => {
    if (!t) return ''
    return dayjs(t).format('YYYY-MM-DD HH:mm')
  },
  second: t => {
    if (!t) return ''
    return dayjs(t).format('YYYY-MM-DD HH:mm:ss')
  },
  // secondWithAgo: t => {
  //   if (!t) return ''
  //   const time = dayjs(t).format('YYYY-MM-DD HH:mm:ss')
  //   return `${time} (${timeAgo(t)})`
  // },
  timestamp: t => {
    if (!t) return ''
    return (new Date(t)).getTime()
  },

  minuteToStr: t => {
    if (!t) return ''
    const h = parseInt(t / 3600)
    const m = parseInt((t % 3600) / 60)
    if (h > 0) {
      return `${h}h${m}m`
    } else if (m > 0) {
      return `${m}m`
    } else {
      return '<1m'
    }
  },
  secondsToStr: t => {
    if (!t) return ''
    const h = parseInt(t / 3600)
    const m = parseInt((t % 3600) / 60)
    const s = parseInt(t % 60)
    if (h > 0) {
      return `${h}h${m}m`
    } else if (m > 0) {
      return `${m}m${s}s`
    } else {
      return `${s}s`
    }
  },

  /** *************** 数据相关 *************** **/
  // 保留小数位的数据展示，结果为字符串
  decimalString (value, decimals = 2) {
    value = parseFloat(value + '')
    value = Number.isNaN(value) ? 0 : value
    return value.toFixed(decimals)
  },
  // 保留小数的浮点型，末尾的0会被自动省略
  decimalFloat (value, decimals = 2) {
    return parseFloat(this.decimalString(value, decimals))
  },
  // 将结果处理为整形，非数字为0。Number('a')、parseInt('a') 结果都是NaN
  int (value) {
    value = parseInt(value + '')
    return Number.isNaN(value) ? 0 : value
  },

  // 文件大小
  fileSize (bytes, decimal = 2) {
    if (!bytes) {
      return '0B'
    }
    if (bytes < 1024) {
      return bytes.toFixed(decimal) + 'B'
    }
    const e = Math.floor(Math.log(bytes) / Math.log(1024))
    return (bytes / Math.pow(1024, e)).toFixed(decimal) + '' + 'KMGTP'.charAt(e - 1) + 'B'
  },
  // 数量转换
  count (count, decimal = 2) {
    count = this.int(count)
    if (count > 100000000) {
      return (count / 100000000).toFixed(decimal) + '亿'
    }
    if (count > 10000) {
      return (count / 10000).toFixed(decimal) + '万'
    }
    return count + ''
  },

  // 提交时，转换后端时间
  submitTime (t) {
    t = t || new Date()
    return dayjs(t).format()
  },
  // 初始化时，转换组件需要的时间
  componentTime (t) {
    t = t || new Date()
    return (new Date(t)).getTime()
  },
}
