import Vue from 'vue'
import App from './App'
import store from './store'
Vue.config.productionTip = false
App.mpType = 'app'

// 引入绑定到vue实例方法
import { vueInjecter }  from './plugins/customerRegister.js'

Vue.use(vueInjecter)

const app = new Vue({
	store,
	...App
})
app.$mount()
