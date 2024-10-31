export default {
  path: 'write',
  component: () => import('@/views/write/index.vue'),
  meta: { title: '辅助撰写', name: 'Write' },
  children: [
    {
      path: '',
      name: 'Write',
      meta: { title: '辅助撰写' },
      component: () => import('@/views/write/index/index.vue'),
    },
    {
      // 交互式撰写
      path: 'interaction',
      component: () => import('@/views/write/interaction/index.vue'),
      meta: { title: '多轮交互撰写', hasBreadcrumb: true, name: 'Write_Interaction' },
      children: [
        {
          path: '',
          name: 'Write_Interaction',
          component: () => import('@/views/write/interaction/list/index.vue'),
        },
        {
          path: ':id',
          component: () => import('@/views/write/interaction/layout/index.vue'),
          children: [
            // 说明书辅助撰写
            {
              path: 'description',
              name: 'Write_Interaction_Description',
              meta: { title: '说明书辅助撰写' },
              component: () => import('@/views/write/interaction/description/index.vue'),
            },
            // 权利要求辅助撰写
            {
              path: 'claims',
              name: 'Write_Interaction_Claims',
              meta: { title: '权利要求辅助撰写' },
              component: () => import('@/views/write/interaction/claims/index.vue'),
            },
            // 摘要辅助撰写
            {
              path: 'summary',
              name: 'Write_Interaction_Summary',
              meta: { title: '说明书摘要辅助撰写' },
              component: () => import('@/views/write/interaction/summary/index.vue'),
            },
            // 全文检查/润色
            {
              path: 'polish',
              name: 'Write_Interaction_Polish',
              meta: { title: '全文检查/润色' },
              component: () => import('@/views/write/interaction/polish/index.vue'),
            },
          ],
        },
      ],
    },
    {
      // 一键式撰写
      path: 'authored',
      component: () => import('@/views/write/authored/layout.vue'),
      meta: { title: '一站式撰写', hasBreadcrumb: true },
      children: [
        {
          path: '',
          name: 'Write_Authored',
          component: () => import('@/views/write/authored/list/index.vue'),
        },
        {
          path: ':id',
          component: () => import('@/views/write/authored/new/layout.vue'),
          meta: { title: '新建项目', name: 'Write_Authored_New' },
          children: [
            {
              path: '',
              name: 'Write_Authored_New',
              component: () => import('@/views/write/authored/new/index.vue'),
            },
            {
              path: 'write',
              name: 'Write_Authored_Write',
              meta: { title: '自行撰写' },
              component: () => import('@/views/write/authored/new/write/index.vue'),
            },
            {
              path: 'result',
              name: 'Write_Authored_Result',
              meta: { title: '检查结果' },
              component: () => import('@/views/write/authored/new/result/index.vue'),
            },
          ],
        },
        // {
        //   path: ':id',
        //   component: () => import('@/views/write/authored/layout/index.vue'),
        //   children: [
        //     // 说明书辅助撰写
        //     {
        //       path: 'description',
        //       name: 'Write_authored_Description',
        //       meta: { title: '说明书辅助撰写' },
        //       component: () => import('@/views/write/authored/description/index.vue'),
        //     },
        //     // 权利要求辅助撰写
        //     {
        //       path: 'claims',
        //       name: 'Write_authored_Claims',
        //       meta: { title: '权利要求辅助撰写' },
        //       component: () => import('@/views/write/authored/claims/index.vue'),
        //     },
        //     // 摘要辅助撰写
        //     {
        //       path: 'summary',
        //       name: 'Write_authored_Summary',
        //       meta: { title: '说明书摘要辅助撰写' },
        //       component: () => import('@/views/write/authored/summary/index.vue'),
        //     },
        //     // 全文检查/润色
        //     {
        //       path: 'polish',
        //       name: 'Write_authored_Polish',
        //       meta: { title: '全文检查/润色' },
        //       component: () => import('@/views/write/authored/polish/index.vue'),
        //     },
        //   ],
        // },
      ],
    },
  ],
}
