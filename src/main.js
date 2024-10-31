import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import installElementPlus from '@/plugins/element-plus'
import installElementPlusIcon from '@/plugins/element-plus-icon'
import installDirectives from '@/directive/index'
import globalComponent from '@/components/common/global'
import '@/styles/index.scss'
import { initLocalStore } from '@/stores'
// import "@/utils/mathjax";

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(globalComponent)
installDirectives(app)
installElementPlus(app)
installElementPlusIcon(app)
initLocalStore()

app.mount('#app')
