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
    var minValue = undefined
    var maxValue = undefined
    for (var phone of allPhones) {
      var value = dotAccess(phone, key)
      var type = typeof value
      if (value === null) {type = 'null'}
      types.add(type)
      if (minValue === undefined || value < minValue) {minValue = value}
      if (maxValue === undefined || value > maxValue) {maxValue = value}
    }
    props[key] = {
      types: types,
      minValue: minValue,
      maxValue: maxValue
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
  for (var k of ['height', 'width', 'thickness', 'weight', 'transistorSize']) {
    props['specs.' + k]['lowerIsBetter'] = true
  }

  console.log(props)
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
    getColor: (state, getters) => (i, k) => {
      var phone = state.allPhones[i]
      var value = getters.getValue(phone, k)
      var kprops = state.keyProperties[k]
      var min = kprops.minValue
      var max = kprops.maxValue
      var rank = (value - min) / (max - min)
      if (kprops.lowerIsBetter) {
        rank = 1-rank
      }
      var colorMap = [{rank: 0, color: [255, 0, 0]},
                      {rank: 0.5, color: [255, 180, 0]},
                      {rank: 1, color: [0, 255, 60]} ]
      var color = [255, 255, 255]
      for (var j in colorMap) {
        if (j == 0) {continue}
        var r0 = colorMap[j-1].rank
        var r1 = colorMap[j].rank
        if (rank >= r0 && rank <= r1) {
          var c0 = colorMap[j-1].color
          var c1 = colorMap[j].color
          for (var ci in color) {
            var localRank = (rank - r0) / (r1 - r0)
            color[ci] = c0[ci] + (c1[ci] - c0[ci]) * localRank
          }
        }
      }
      //console.log(min + ' - ' + value + ' - ' + max + ' - ' + rank)
      return 'rgb(' + color.join() + ')'
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
