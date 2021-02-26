import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

import './plugins/element.js'
//导入字体图标
import 'assets/font/iconfont.css'
import 'assets/fonts/iconfont.css'


import TreeTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
    //将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor, /* { default global options } */ )

Vue.component('tree-table', TreeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')