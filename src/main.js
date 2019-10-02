import '@fortawesome/fontawesome-free/css/all.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/css/bootstrap-theme.css'
import Vue from 'vue'
import App from './App.vue'

Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')
