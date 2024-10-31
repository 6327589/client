export default {
  path: 'analysis',
  component: () => import('@/views/analysis/index.vue'),
  meta: { title: '专利分析', name: 'Analysis' },
  children: [
    {
      path: '',
      name: 'Analysis',
      meta: { title: '专利分析' },
      component: () => import('@/views/analysis/index/index.vue'),
    },
    {
      path: 'contrast',
      component: () => import('@/views/analysis/contrast/index.vue'),
      meta: { title: '对比查看', hasBreadcrumb: true, name: 'Analysis_Contrast' },
      children: [
        {
          path: '',
          name: 'Analysis_Contrast',
          component: () => import('@/views/analysis/contrast/view.vue'),
        },
        {
          path: 'write',
          name: 'Analysis_Contrast_Write',
          component: () => import('@/views/analysis/contrast/write.vue'),
        },
      ],
    },
    {
      path: 'disclosure',
      component: () => import('@/views/analysis/disclosure/layout.vue'),
      meta: { title: '交底查新', hasBreadcrumb: true, name: 'Analysis_Disclosure' },
      children: [
        {
          path: '',
          name: 'Analysis_Disclosure',
          component: () => import('@/views/analysis/disclosure/list/index.vue'),
        },
        {
          path: ':id',
          component: () => import('@/views/analysis/disclosure/new/layout.vue'),
          meta: { title: '新建项目', name: 'Analysis_Disclosure_New' },
          children: [
            {
              path: '',
              name: 'Analysis_Disclosure_New',
              component: () => import('@/views/analysis/disclosure/new/index.vue'),
            },
            {
              path: 'write',
              name: 'Analysis_Disclosure_Write',
              meta: { title: '自行撰写' },
              component: () => import('@/views/analysis/disclosure/new/write/index.vue'),
            },
            {
              path: 'result',
              name: 'Analysis_Disclosure_Result',
              meta: { title: '检查结果' },
              component: () => import('@/views/analysis/disclosure/new/result/index.vue'),
            },
          ],
        },
      ],
    },
  ],
}
