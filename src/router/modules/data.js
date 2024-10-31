export default {
  path: 'data',
  component: () => import('@/views/data/index.vue'),
  children: [
    {
      path: 'get',
      name: 'Data_Get',
      component: () => import('@/views/data/get.vue'),
    },
  ],
}
