import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

var events = new WeakMap()
Vue.directive('click-outside', {
  bind (el, binding, vnode) {
    events.set(el, function (event) {
      if (!(el == event.target || el.contains(event.target))) {
        vnode.context[binding.expression](event)
      }
    })
    document.body.addEventListener('click', events.get(el))
  },
  unbind(el) {
    document.body.removeEventListener('click', events.get(el))
    events.delete(el)
  }
})

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
