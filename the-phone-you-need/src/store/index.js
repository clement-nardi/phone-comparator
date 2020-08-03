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
      var type = typeof value
      if (value === null) {type = 'null'}
      types.add(type)
    }
    props[key] = {
      types: types
    }
  }
  props['name']['width'] = '140px'
  props['name']['getValue'] = (phone) => {
    var name = phone['name'].split(' ').slice(1).join(' ')
    return name
  }
  props['name']['getLabel'] = (value) => {
    var match = value.match(/SM-.\d\d\d - (.*)/)
    if (match) {return match[1]}
    return value
  }
  props['specs.os']['width'] = '20px'
  props['brand'] = {
    getValue: (phone) => phone['name'].split(' ')[0],
    types: ['string']
  }
  props['specs.height']['getLabel'] = Math.round
  props['specs.width']['getLabel'] = Math.round
  return props
}

function getType(types) {
  for (var type of types) {
    if (type != 'undefined' && type != 'null') {
      return type
    }
  }
}

const allKeys = ['brand', 'name', ...getAllSpecKeys(allPhones)]

export default new Vuex.Store({
  state: {
    allPhones: allPhones.slice(0,20),
    allKeys: allKeys,
    keyProperties: getKeyProperties(allKeys)
  },
  getters: {
    getValue: state => (phone, k) => {
      var kprops = state.keyProperties[k]
      if (kprops.getValue) {
        return kprops.getValue(phone)
      } else {
        return dotAccess(phone, k)
      }
    },
    getLabel: (state, getters) => (i, k) => {
      var rawData = getters.getValue(state.allPhones[i], k)
      var kprops = state.keyProperties[k]
      if (rawData !== undefined && rawData !== null) {
        switch (getType(state.keyProperties[k].types)) {
          case 'boolean':
            return rawData?'Y':'N'
          default:
            if (kprops['getLabel']) {
              return kprops['getLabel'](rawData)
            }
            return rawData
        }
      } else {
        return ''
      }
    },
    getTooltip: (state, getters) => (i, k) => {
      var rawData = getters.getValue(state.allPhones[i], k)
      return rawData
    },
    getHeader: () => (k) => {
      return k.split('.').pop()
    },
    getHeaderWidth: (state) => (k) => {
      var kprops = state.keyProperties[k]
      if (kprops['width']) {return kprops['width']}
      switch (getType(kprops.types)) {
        case 'boolean':
          return '8px'
        default:
          return 'auto'
      }
    },
    getHeaderTooltip: (state, getters) => (k) => {
      return getters.getHeader(k)
    }
  },
  mutations: {
  }
})
