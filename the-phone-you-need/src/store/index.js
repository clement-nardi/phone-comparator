import Vue from 'vue'
import Vuex from 'vuex'
import allPhones from '../../../data-management/allSpecs.json'

Vue.use(Vuex)

function getAllSpecKeys(allPhones) {
  var allKeys = new Set()
  for (var phone of allPhones) {
    if (phone.specs) {
      allKeys = new Set([...Object.keys(phone.specs).map(x => 'specs.' + x), ...allKeys])
    }
  }
  return [...allKeys]
}

function dotAccess(obj, dottedKey) {
  try {
    return keyListAccess(obj, dottedKey.split('.'))
  } catch (e) {
    return undefined
  }
}

function keyListAccess(obj, list) {
  if (list.length == 1) {
    return obj[list[0]]
  } else {
    return keyListAccess(obj[list[0]], list.slice(1))
  }
}

function getKeyProperties(allKeys) {
  var props = {}
  for (var key of allKeys) {
    var types = new Set()
    for (var phone of allPhones) {
      var value = dotAccess(phone, key)
      if (typeof value === 'object' && key === "specs.androidVersion") {
        console.log(phone)
        console.log(value)
      }
      types.add(typeof value)
    }
    props[key] = {
      types: types
    }
  }
  console.log(props)
  return props
}

const allKeys = ['name', ...getAllSpecKeys(allPhones)]

export default new Vuex.Store({
  state: {
    allPhones: allPhones.slice(0,20),
    allKeys: allKeys,
    keyProperties: getKeyProperties(allKeys)
  },
  getters: {
    getLabel: state => (i, k) => {
      var rawData = dotAccess(state.allPhones[i], k)
      if (rawData !== undefined) {
        return rawData
      } else {
        return ''
      }
    },
    getTooltip: (state, getters) => (i, k) => {
      return getters.getLabel(i,k)
    },
    getHeader: (state) => (i) => {
      return state.allKeys[i].split('.').pop()
    },
    getHeaderTooltip: (state, getters) => (i) => {
      return getters.getHeader(i)
    }
  },
  mutations: {
  }
})
