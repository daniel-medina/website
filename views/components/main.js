/** We import all vue components in order to bundle them with webpack */
import Vue from 'vue'
import Portfolio from './Portfolio.vue'
import Menu from './Menu.vue'

Vue.component('portfolio', Portfolio)
Vue.component('menuxs', Menu)

new Vue({ // eslint-disable-line
  el: '#website'
})
