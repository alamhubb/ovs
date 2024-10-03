import {createApp} from 'vue'
import App from './App.vue'
import 'qing-scss/src/index.ts'
import { dokoFun } from '@/doko/doko'
import { newTestDokoVue} from '@/components/dokoProxy'




dokoFun(testDokoVue,newTestDokoVue)

createApp(App).mount('#app')
