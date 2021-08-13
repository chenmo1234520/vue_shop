import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/globale.css'
import './assets/fonts/iconfont.css'
import axios from 'axios'
import ZkTable from 'vue-table-with-tree-grid'

Vue.component(ZkTable.name, ZkTable)
Vue.prototype.$http = axios
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.config.productionTip = false
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
