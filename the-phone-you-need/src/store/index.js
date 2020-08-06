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
  for (var v of allKeys) {
    props[v] = {}
  }
  props['name']['width'] = '140px'
  props['name']['getValue'] = (phone) => {
    var name = phone['name'].split(' ').slice(1).join(' ')
    return name
  }
  props['name']['getLabel'] = (phone) => {
    var value = props['name']['getValue'](phone)
    var match = value.match(/SM-.\d\d\d - (.*)/)
    if (match) {value = match[1]}
    if (phone.searchResults && phone.searchResults.length > 0) {
      value = '<a target="_blank" href=https://www.gsmarena.com/' + phone.searchResults[0].link + '>' + value + '</a>'
    }
    return value
  }
  props['specs.os']['width'] = '20px'
  props['brand'] = {
    getValue: (phone) => phone['name'].split(' ')[0],
    types: ['string']
  }
  props['specs.height']['adaptValue'] = Math.round
  props['specs.width']['adaptValue'] = Math.round
  for (var k of ['height', 'width', 'thickness', 'weight', 'transistorSize']) {
    props['specs.' + k]['lowerIsBetter'] = true
  }

  props['price']['getLabel'] = (phone) => {
    var value = Math.round(phone.price) + '€'
    if (phone.link ) {
      value = '<a target="_blank" href=https://www.i-comparateur.com/' + phone.link + '>' + value + '</a>'
    }
    return value
  }
  props['price']['lowerIsBetter'] = true

  props['specs.memoryVersions']['getLabel'] = phone => {
    var mems = phone.specs.memoryVersions
    var label = ''
    for (var mem of mems) {
      label += mem.RAM + '/' + mem.storage + 'G '
    }
    return label
  }

  props['RAM min']['getValue'] = (phone) => {
    if (phone.specs && phone.specs.memoryVersions && phone.specs.memoryVersions.length>0) {
      return Math.min(...((phone.specs.memoryVersions).map(m => m.RAM)))
    } else {
      return undefined
    }
  }
  props['Storage min']['getValue'] = (phone) => {
    if (phone.specs && phone.specs.memoryVersions && phone.specs.memoryVersions.length>0) {
      return Math.min(...((phone.specs.memoryVersions).map(m => m.storage)))
    } else {
      return undefined
    }
  }

  for (let key of allKeys) {
    analysePropValues(props, key)
  }

  props['Score']['getValue'] = (phone) => {
    let phoneScore = 0
    for (let key of allKeys) {
      if (key == 'Score' || key == 'Score/Price ratio') {continue}
      let kprops = props[key]
      let type = getType(kprops.types)
      if (type == 'number' || type == 'boolean') {
        let keyScore = getScore(phone, key, props[key])
        if (typeof keyScore == 'number') {
          if (isNaN(keyScore)) {
            console.log(key)
          }
          phoneScore += keyScore * 10
        }
      }
    }
    return phoneScore
  }

  props['Score/Price ratio']['getValue'] = phone => {
    return props['Score']['getValue'](phone) / phone.price
  }

  analysePropValues(props, 'Score')
  analysePropValues(props, 'Score/Price ratio')

  return props
}

function analysePropValues(props, key) {
  var types = new Set()
  var minValue = undefined
  var maxValue = undefined
  for (var phone of allPhones) {
    var value = getValue(phone, key, props[key])
    var type = typeof value
    if (value === null) {type = 'null'}
    types.add(type)
    if (value == null || value == undefined) {continue}
    if (minValue === undefined || value < minValue) {minValue = value}
    if (maxValue === undefined || value > maxValue) {maxValue = value}
  }
  props[key].types = types
  props[key].minValue = minValue
  props[key].maxValue = maxValue
}

function getType(types) {
  for (var type of types) {
    if (type != 'undefined' && type != 'null') {
      return type
    }
  }
  return undefined
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
  /* This array determines the columns order */
  const allKeys = [
    "brand",
    "name",
    "price",
    "Score",
    "Score/Price ratio",
    "specs.height",
    "specs.width",
    "specs.thickness",
    "specs.weight",
    "specs.ipCertification",
    "specs.gorillaGlassVersion",
    "specs.screenSize",
    "specs.screenToBodyRatio",
    "specs.hasOLED",
    "specs.resolutionWidth",
    "specs.resolutionHeight",
    "specs.ppi",
    "specs.refreshRate",
    "specs.os",
    "specs.androidVersion",
    "specs.hasGoogleServices",
    "specs.nbCores",
    "specs.maxClock",
    "specs.transistorSize",
    "specs.memoryVersions",
    "RAM min",
    "Storage min",
    "specs.rearCameraModules",
    "specs.maxFPS",
    "specs.frontCameraModules",
    "specs.batteryCapacity",
    "specs.enduranceRating",
    "specs.maxChargingPower",
    "specs.wirelessCharging",
    "specs.usbC",
  ]
  for (var key of allSpecKeys) {
    if (!allKeys.includes(key)) {allKeys.push(key)}
  }
  return allKeys
}

function getScore(phone, k, kprops) {
  let value = getValue(phone, k, kprops)
  const min = kprops.minValue
  const max = kprops.maxValue
  if (! (max-min) ||value == undefined) {
    return undefined
  }
  let score = (value - min) / (max - min)
  if (kprops.lowerIsBetter) {
    score = 1-score
  }
  if (isNaN(score)) {
    console.log(k + ' - ' + value + ' - ' + min + ' - ' + max)
  }
  return score
}

function getFilters(keyProperties) {
  let filters = {}
  for (let k in keyProperties) {
    let p = keyProperties[k]
    if (p.filters) {
      filters[k] = p.filters
    }
  }
  return filters
}

function getFilteredPhones(phones, keyProperties) {
  let filteredPhones = []
  let filters = getFilters(keyProperties)
  for (let phone of phones) {
    let isFilteredOut = false
    for (let k in filters) {
      for (let fk in filters[k]) {
        let v = getValue(phone, k, keyProperties[k])
        let fv = filters[k][fk]
        switch (fk) {
          case 'min':
            if (v < fv) {
              isFilteredOut = true
            }
            break
          case 'max':
            if (v > fv) {
              isFilteredOut = true
            }
            break
        }
        if (isFilteredOut) {break}
      }
      if (isFilteredOut) {break}
    }
    if (!isFilteredOut) {
      filteredPhones.push(phone)
    }
  }
  return filteredPhones
}

function sortBy(phones, key, bestFirst, kprops) {
  var coef = (kprops.lowerIsBetter?-1:1) * (bestFirst?1:-1)
  /* this way, empty values are shown at the top when requesting "see worst first" */
  //var defaultValue = kprops.lowerIsBetter?(kprops.maxValue + 1):(kprops.minValue - 1)
  /* Empty values always at the bottom */
  var defaultValue = (coef==-1)?(kprops.maxValue + 1):(kprops.minValue - 1)
  phones.sort((a,b) => {
    var va = getValue(a, key, kprops)
    var vb = getValue(b, key, kprops)
    if (va == undefined) { va = defaultValue }
    if (vb == undefined) { vb = defaultValue }
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

var allKeys = getallKeys()
var keyProperties = getKeyProperties(allKeys)
var filteredPhones = getFilteredPhones(allPhones, keyProperties)
sortBy(filteredPhones, 'Score', true, keyProperties['Score'])

export default new Vuex.Store({
  state: {
    allPhones: allPhones,
    keyProperties: keyProperties,
    filteredPhones: filteredPhones,
    nbVisiblePhones: 100,
    allKeys: allKeys,
    configKey: null,
    configPos: 0,
    sortKey: 'Score',
    sortBestFirst: true
  },
  getters: {
    getPhones: state => () => {
      return state.filteredPhones.slice(0,state.nbVisiblePhones)
    },
    getValue: state => (phone, k) => {
      var kprops = state.keyProperties[k]
      return getValue(phone, k, kprops)
    },
    getLabel: (state, getters) => (phone, k) => {
      var rawData = getters.getValue(phone, k)
      var kprops = state.keyProperties[k]
      if (rawData !== undefined && rawData !== null) {
        if (kprops['getLabel']) {
          return kprops['getLabel'](phone)
        }
        switch (getType(state.keyProperties[k].types)) {
          case 'boolean':
            return rawData?'Y':'N'
          case 'object':
            return JSON.stringify(rawData)
          default:
            if (kprops['adaptValue']) {
              return kprops['adaptValue'](rawData)
            }
            return rawData
        }
      } else {
        return ''
      }
    },
    getTooltip: (state, getters) => (phone, k) => {
      var rawData = getters.getValue(phone, k)
      if (typeof rawData == 'object') {
        rawData = JSON.stringify(rawData, null, 2).replace(/\n/g, '<br>')
      }
      return getters.getHeader(k) + ': ' + rawData
    },
    getColor: (state) => (phone, k) => {
      let kprops = state.keyProperties[k]
      let score = getScore(phone, k, kprops)
      let colorMap = [{score: 0, color: [255, 0, 0]},
                      {score: 0.5, color: [255, 180, 0]},
                      {score: 1, color: [0, 255, 60]} ]
      let color = [255, 255, 255]
      for (let j in colorMap) {
        if (j == 0) {continue}
        let r0 = colorMap[j-1].score
        let r1 = colorMap[j].score
        if (score >= r0 && score <= r1) {
          let c0 = colorMap[j-1].color
          let c1 = colorMap[j].color
          for (let ci in color) {
            let localscore = (score - r0) / (r1 - r0)
            color[ci] = c0[ci] + (c1[ci] - c0[ci]) * localscore
          }
        }
      }
      return 'rgb(' + color.join() + ')'
    },
    getHeader: () => (k) => {
      if (!k) {return undefined}
      var spec = k.split('.').pop()
      return spec[0].toUpperCase() + spec.slice(1)
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
    sortBy (state, payload) {
      var key = payload.key
      var bestFirst = payload.bestFirst
      state.sortKey = key
      state.sortBestFirst = bestFirst
      var kprops = state.keyProperties[key]
      sortBy(state.filteredPhones, key, bestFirst, kprops)
    },
    setConfigKey (state, p) {
      state.configKey = p.key
      state.configPos = p.pos
    },
    applyFilter (state, p) {
      let key = p.key
      let filterType = p.filterType
      let filterValue = p.filterValue
      if (! state.keyProperties[key].filters) {
        state.keyProperties[key].filters = {}
      }
      state.keyProperties[key].filters[filterType] = filterValue
      let filteredPhones = getFilteredPhones(state.allPhones, state.keyProperties)
      sortBy(filteredPhones, state.sortKey, state.sortBestFirst, state.keyProperties[state.sortKey])
      Vue.set(state, 'filteredPhones', filteredPhones)
      console.log(state.filteredPhones.length + '/' + state.allPhones.length)
    }
  }
})
