import Vue from 'vue'
import Vuex from 'vuex'
import allSpecs from '../../../data-management/allSpecs.json'

Vue.use(Vuex)

function getAllAttributes(allSpecs) {
  var allKeys = new Set()
  for (var spec of allSpecs) {
    if (spec.specs) {
      allKeys = new Set([...Object.keys(spec.specs), ...allKeys])
    }
  }
  return [...allKeys]
}

export default new Vuex.Store({
  state: {
    allSpecs: allSpecs.slice(0,20),
    allKeys: getAllAttributes(allSpecs)
  },
  mutations: {
  }
})
