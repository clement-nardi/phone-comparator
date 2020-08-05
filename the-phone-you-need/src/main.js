import Vue from 'vue'
import App from './App.vue'
import store from './store'

Vue.config.productionTip = false

Vue.directive('click-outside', {
  bind (el, binding, vnode) {
        window.event = function (event) {
            if (!(el == event.target || el.contains(event.target))) {
                vnode.context[binding.expression](event);
            }
        };
        document.body.addEventListener('click', window.event)
  },
  unbind() {
        document.body.removeEventListener('click', window.event)
    },

  stopProp(event) { event.stopPropagation() }
})

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
