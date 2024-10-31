export default {
  path: 'search',
  component: () => import('@/views/search/index.vue'),
  children: [
    {
      path: '',
      component: () => import('@/views/search/layout/index.vue'),
      name: 'Search',
      redirect: '/search/general',
      children: [
        // 普通检索
        {
          path: 'general',
          name: 'Search_General',
          component: () => import('@/views/search/general/index.vue'),
        },
        // 语义检索
        {
          path: 'semantic',
          name: 'Search_Semantic',
          component: () => import('@/views/search/semantic/index.vue'),
        },
        // 检索帮助
        {
          path: 'help',
          name: 'Search_Help',
          component: () => import('@/views/search/help/index.vue'),
        },
      ],
    },
    // 普通检索列表
    {
      path: 'general/list',
      name: 'Search_General_List',
      component: () => import('@/views/search/general/list/index.vue'),
    },
    // 语义列表
    {
      path: 'semantic/list',
      name: 'Search_Semantic_List',
      component: () => import('@/views/search/semantic/list/index.vue'),
    },
    // 查看专利
    {
      path: 'detail/:id',
      name: 'Search_Detail',
      component: () => import('@/views/search/detail/index.vue'),
    },

  ],
}
