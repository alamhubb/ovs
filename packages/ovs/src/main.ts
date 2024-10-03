import { createApp } from 'vue'
import App from './App.vue'
import 'qing-scss/src/index.ts'
import { dokoFun } from '@/doko/doko'
import { newTestDokoVue } from '@/components/dokoProxy'
import { Testdoko } from '@/components/testdoko.vue'


dokoFun(Testdoko, newTestDokoVue)
console.log(Testdoko.renderHeader())
console.log(newTestDokoVue.renderHeader())
createApp(App).mount('#app')
