export default {
  path: 'profile',
  component: () => import('@/views/profile/index.vue'),
  redirect: 'profile/info',
  children: [
    {
      path: 'info',
      name: 'Profile_Info',
      component: () => import('@/views/profile/info/index.vue'),
    },
    {
      path: 'record',
      name: 'Profile_Record',
      component: () => import('@/views/profile/record/index.vue'),
    },
    {
      path: 'notice',
      name: 'Profile_Notice',
      component: () => import('@/views/profile/notice/index.vue'),
    },
  ],
}
