import { createApp } from 'vue'
import App from './App.vue'
import 'qing-scss/src/index.ts'
import { dokoFun } from '@/doko/doko'
import { newTestDokoVue } from '@/components/dokoProxy'
import { Testdoko } from '@/components/testdoko.vue'

import "@/ovs/transform/transformOvs/VariableStatementOvsTransformer"
import "@/ovs/transform/transformEs6/ObjectLiteralEs6Transformer"

dokoFun(Testdoko, newTestDokoVue)
console.log(Testdoko.renderHeader())
console.log(newTestDokoVue.renderHeader())
createApp(App).mount('#app')