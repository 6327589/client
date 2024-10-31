import useBaseLocalStore from '@/stores/local'

export const getRouteQuery = (tableName, searchData = []) => {
  const baseLocalStore = useBaseLocalStore()
  const q = baseLocalStore.pageOptions[tableName]
  if (!q) {
    return null
  }

  // 根据需要做转换
  // if (q.store_ids) {
  //   q.store_ids = q.store_ids.split(',')
  // }
  // 根据需要做转换
  // if (q.begin_time) {
  //   q.begin_time = format('submitTime', q.begin_time)
  // }
  // if (q.end_time) {
  //   q.end_time = format('submitTime', q.end_time)
  // }

  const filters = []
  for (const k in q) {
    if (k !== 'limit' && k !== 'offset' && k !== 'order_by') {
      let v = q[k]
      const searchItem = searchData.find(x => x.field === k)
      if (searchItem) {
        if (searchItem.dataType === 'string') {
          if (v !== '') {
            filters.push({
              Field: k,
              Value: [v],
              ExactMatch: !!searchItem.exactMatch,
            })
          }
        } else { // array
          v = v.split(',')
          if (v.length > 0) {
            filters.push({
              Field: k,
              Value: v,
              ExactMatch: !!searchItem.exactMatch,
            })
          }
        }
      }
    }
  }

  let OrderBy = null
  if (q.order_by) {
    OrderBy = [q.order_by]
  }
  return {
    Limit: Number(q.limit),
    Offset: Number(q.offset),
    Filters: filters,
    OrderBy,
  }
}
export const updateRouteQuery = (tableName, obj, clearOtherQuery = false) => {
  const baseLocalStore = useBaseLocalStore()
  const oldQuery = baseLocalStore.pageOptions[tableName]
  let s // 最后保存在store中的query

  // 不含分页的query
  if (!Object.prototype.hasOwnProperty.call(obj, 'offset')) {
    if (clearOtherQuery) {
      s = Object.assign({ limit: 10, offset: 0, current: 1, total: 0 }, obj)
    } else {
      s = Object.assign({}, oldQuery, obj, { offset: 0, current: 1 })
    }
  } else { // 分页相关
    s = Object.assign({}, oldQuery, obj)
  }
  const t = new Date().getTime()
  s.t = t

  // 保存到store中
  baseLocalStore.setPageOption(tableName, s)
}
export const rmRouteQuery = (tableName) => {
  const baseLocalStore = useBaseLocalStore()
  baseLocalStore.rmPageOption(tableName)
}

export const clearRouteQuery = () => {
  const baseLocalStore = useBaseLocalStore()
  baseLocalStore.clearPageOption()
}
