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

  return props
}

function getType(types) {
  for (var type of types) {
    if (type != 'undefined' && type != 'null') {
      return type
    }
  }
}

function getValue(phone, key, kprops) {
  if (kprops.getValue) {
    return kprops.getValue(phone)
  } else {
    return dotAccess(phone, key)
  }
}

function getallKeys() {
  const allSpecKeys = getAllSpecKeys(allPhones)
  const allKeys = [
    "brand",
    "name",
    "specs.height",
    "specs.width",
    "specs.thickness",
    "specs.weight",
    "specs.ipCertification",
    "specs.hasOLED",
    "specs.screenSize",
    "specs.screenToBodyRatio",
    "specs.resolutionWidth",
    "specs.resolutionHeight",
    "specs.ppi",
    "specs.os",
    "specs.androidVersion",
    "specs.hasGoogleServices",
    "specs.transistorSize",
    "specs.nbCores",
    "specs.maxClock",
    "specs.memoryVersions",
    "specs.rearCameraModules",
    "specs.maxFPS",
    "specs.frontCameraModules",
    "specs.usbC",
    "specs.batteryCapacity",
    "specs.enduranceRating",
    "specs.maxChargingPower",
    "specs.wirelessCharging",
    "specs.gorillaGlassVersion",
    "specs.refreshRate"
  ]
  for (var key of allSpecKeys) {
    if (!allKeys.includes(key)) {allKeys.push(key)}
  }
  return allKeys
}

const allKeys = getallKeys()

export default new Vuex.Store({
  state: {
    allPhones: allPhones.slice(0, 50),
    allKeys: allKeys,
    keyProperties: getKeyProperties(allKeys),
    sortKey: undefined,
    sortAscending: false
  },
  getters: {
    getValue: state => (phone, k) => {
      var kprops = state.keyProperties[k]
      return getValue(phone, k, kprops)
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
      var score = (value - min) / (max - min)
      if (kprops.lowerIsBetter) {
        score = 1-score
      }
      var colorMap = [{score: 0, color: [255, 0, 0]},
                      {score: 0.5, color: [255, 180, 0]},
                      {score: 1, color: [0, 255, 60]} ]
      var color = [255, 255, 255]
      for (var j in colorMap) {
        if (j == 0) {continue}
        var r0 = colorMap[j-1].score
        var r1 = colorMap[j].score
        if (score >= r0 && score <= r1) {
          var c0 = colorMap[j-1].color
          var c1 = colorMap[j].color
          for (var ci in color) {
            var localscore = (score - r0) / (r1 - r0)
            color[ci] = c0[ci] + (c1[ci] - c0[ci]) * localscore
          }
        }
      }
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
      var kprops = state.keyProperties[k]
      var tooltip = getters.getHeader(k) + '<br>' +
             'type : ' + getType(kprops.types) + '<br>' +
             'best : ' + (kprops.lowerIsBetter?kprops.minValue:kprops.maxValue) + '<br>' +
             'worst: ' + (kprops.lowerIsBetter?kprops.maxValue:kprops.minValue)

      return tooltip
    }
  },
  mutations: {
    sortBy (state, key) {
      if (state.sortKey == key) {
        state.sortAscending = !state.sortAscending
      } else {
        state.sortKey = key
        state.sortAscending = false
      }
      var kprops = state.keyProperties[key]
      state.allPhones.sort((a,b) => {
        var va = getValue(a, key, kprops)
        var vb = getValue(b, key, kprops)
        if (va == undefined) { va = 0 }
        if (vb == undefined) { vb = 0 }
        var coef = (kprops.lowerIsBetter?-1:1) * (state.sortAscending?-1:1)
        var compare
        switch (getType(kprops.types)) {
          case 'string':
            compare = va.localeCompare(vb)
            break
          default:
            compare = (vb - va)
        }
        return compare * coef
      })
    }
  }
})
