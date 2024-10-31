import { createRouter, createWebHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import Layout from '@/views/layout/index.vue'
import Login from '@/views/other/login.vue'
import Home from '@/views/other/home.vue'
import About from '@/views/other/about.vue'
import Register from '@/views/other/register.vue'
import BindWx from '@/views/other/bindWx.vue'
import ChangeWx from '@/views/other/changeWx.vue'
import useBaseLocalStore from '@/stores/local'
import config from '@/config'

const allModules = import.meta.glob('./modules/*.js', { eager: true })
const routeList = []
Object.keys(allModules).forEach(path => {
  const fileName = path.replace(/(.*\/)*([^.]+).*/ig, '$2')
  const route = allModules[path][fileName] || allModules[path].default || allModules[path]
  routeList.push(route)
})

const appRoute = {
  path: '/',
  component: Layout,
  children: [
    ...routeList,
    {
      path: '/notaccess',
      name: 'NotAccess',
      meta: { title: '没有权限' },
      component: () => import('@/views/other/notAccess.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/other/notFound.vue'),
    },
  ],
}

const router = createRouter({
  history: createWebHistory(config.baseUrl),
  routes: [
    appRoute,
    {
      path: '',
      name: 'Home',
      component: Home,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: Register,
    },
    {
      path: '/bindWx',
      name: 'BindWx',
      component: BindWx,
    },
    {
      path: '/changeWx',
      name: 'ChangeWx',
      component: ChangeWx,
    },
  ],
})

NProgress.configure({ showSpinner: false })
// const noLoginWhiteList = ['Login', 'Home', 'About', 'Register', 'NotAccess', 'NotFound', 'BindWx', 'Search']
const loginList = ['Write', 'Analysis_Contrast', 'Analysis_Contrast_Write']
// router white list
const whiteList = [
  'Profile',
  'NotAccess',
  'ChangeWx',
]

router.beforeEach((to, from, next) => {
  NProgress.start()
  const baseLocalStore = useBaseLocalStore()
  // const commonStore = useCommonStore()

  if (baseLocalStore.token) {
    if (to.name === 'Login') {
      next({ path: '/' })
    } else {
      next()
      // if (whiteList.includes(to.name)) {
      //   next()
      // } else {
      //   const authList = commonStore.authList
      //   if (config.env === 'development' || config.env === 'test' || !authList.length || authList.includes(to.name)) {
      //     next()
      //   } else {
      //     ElMessage.warning("You don't have permission")
      //     if (!from.name) {
      //       next({ path: '/notaccess', replace: true, query: { noGoBack: true, path: to.path } })
      //     } else {
      //       next(false)
      //     }
      //   }
      // }
    }
  } else {
    if (to.path.startsWith('/write') || loginList.includes(to.name)) {
      baseLocalStore.setLogout()
    } else {
      next()
    }
  }
})
router.afterEach(() => {
  NProgress.done()
})

export default router
