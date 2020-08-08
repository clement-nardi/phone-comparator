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

function getKeyProperties() {
  var props = {}
  for (var v of allKeys) {
    props[v] = {filters: {keepEmpty: true}}
  }
  props['name']['width'] = '100px'
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

  props['brand']['getValue'] = (phone) => phone['name'].split(' ')[0],
  props['brand']['types'] = ['string']

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

  /*
  props['specs.memoryVersions']['getLabel'] = phone => {
    var mems = phone.specs.memoryVersions
    var label = ''
    for (var mem of mems) {
      label += mem.RAM + '/' + mem.storage + 'G '
    }
    return label
  }*/

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


  /* Camera Properties */

  let modules = ['main', 'tele', 'wide', 'selfie']
  let camSpecs = [
    'MP',
    'FocalLength',
    'OpticalZoom',
    'MaxAperture',
    'SensorSize',
    'PixelSize',
    'HasOIS',
    'HasPhaseDetection',
    'HasOmniPhaseDetection'
  ]

  function getModule(mod, phone) {
    if (!phone.specs) {return undefined}
    if (mod == 'selfie') {
      if (!phone.specs.frontCameraModules || phone.specs.frontCameraModules.length == 0) {return undefined}
      return phone.specs.frontCameraModules[0]
    }
    if (!phone.specs.rearCameraModules || phone.specs.rearCameraModules.length == 0) {return undefined}
    if (mod == 'main') {
      return phone.specs.rearCameraModules[0]
    }
    if (phone.specs.rearCameraModules.length == 1) {return undefined}
    let cam = undefined
    for (let pm of phone.specs.rearCameraModules.slice(1)) {
      let mfl = 24
      let fl = undefined
      switch (mod) {
        case 'tele':
          if (phone.specs.rearCameraModules[0].focalLength) {mfl = phone.specs.rearCameraModules[0].focalLength}
          if (pm.focalLength) {
            fl = pm.focalLength
          } else if (pm.opticalZoom) {
            fl = mfl * pm.opticalZoom
          }
          if (!fl) {continue}
          if (fl > mfl) {
            if (cam == undefined || fl > cam.focalLength) {
              cam = pm
            }
          }
          break
        case 'wide':
          if (pm.focalLength < phone.specs.rearCameraModules[0].focalLength) {
            if (cam == undefined || pm.focalLength < cam.focalLength) {
              cam = pm
            }
          }
          break
      }
    }
    return cam

  }

  for (let mod of modules) {
    for (let spec of camSpecs) {
      let k = mod + 'Camera' + spec
      if (!allKeys.includes(k)) {
        continue
      }
      if (spec == 'MaxAperture') {
        props[k]['lowerIsBetter'] = true
      }
      props[k]['getValue'] = (phone) => {
        let pm = getModule(mod, phone)
        if (!pm) {
          return undefined
        }
        switch (spec) {
          case 'MP':
            return pm.megapixels
          case 'FocalLength':
            return pm.focalLength
          case 'OpticalZoom':
            return pm.opticalZoom
          case 'MaxAperture':
            return pm.maxAperture
          case 'SensorSize':
            return pm.sensorSize
          case 'PixelSize':
            return pm.pixelSize
          case 'HasOIS':
            return pm.OIS
          case 'HasPhaseDetection':
            if (!pm.autofocus) {return false}
            return pm.autofocus.includes('PD')
          case 'HasOmniPhaseDetection':
            if (!pm.autofocus) {return false}
            return pm.autofocus.includes('omni')
        }
      }
    }
  }

  props['nbRearCameraModules']['getValue'] = (phone) => {
    if (!phone.specs || !phone.specs.rearCameraModules) {return 0}
    return phone.specs.rearCameraModules.length
  }
  props['nbFrontCameraModules']['getValue'] = (phone) => {
    if (!phone.specs || !phone.specs.frontCameraModules) {return 0}
    return phone.specs.frontCameraModules.length
  }


  /* Small columns: 1 figure */
  let smallColumns = ['specs.gorillaGlassVersion', 'specs.os', 'specs.nbCores', 'nbRearCameraModules', 'teleCameraOpticalZoom', 'nbFrontCameraModules']
  for (let key of smallColumns) {
    props[key].width = '8px'
  }
  /* 2 figures */
  let mediumColumns = [
    'specs.width',
    'specs.ipCertification',
    'specs.androidVersion',
    'specs.transistorSize',
    'RAM min',
    'mainCameraFocalLength',
    'teleCameraMP',
    'wideCameraMP',
    'wideCameraFocalLength',
    'selfieCameraMP',
    'selfieCameraFocalLength',
    'specs.maxChargingPower'
  ]
  for (let key of mediumColumns) {
    props[key].width = '16px'
  }
  /* 2 figures and a '.' */
  let mediumColumns2 = ['specs.thickness', 'mainCameraMaxAperture', 'teleCameraMaxAperture', 'wideCameraMaxAperture', 'selfieCameraMaxAperture']
  for (let key of mediumColumns2) {
    props[key].width = '19px'
  }

  for (let key of allKeys) {
    analysePropValues(props, key)
  }

  /* remove meaningless columns */
  for (let key of allKeys.filter(v => !v.startsWith('Score'))) {
    if (props[key].values.filter(v => v).length == 0) {
      console.log('only 1 possible value: removing ' + key)
      delete props[key]
      allKeys = allKeys.filter(v => v!=key)
    }
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


  /* set default filters here */

  props['RAM min'].filters.keepEmpty = false
  props['RAM min'].filters.min = 4



  return props
}

function analysePropValues(props, key) {
  let types = new Set()
  let minValue = undefined
  let maxValue = undefined
  let values = new Set()
  for (var phone of allPhones) {
    var value = getValue(phone, key, props[key])
    values.add(value)
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
  props[key].minFilteredValue = minValue
  props[key].maxFilteredValue = maxValue
  props[key].values = [...values].sort()
}

function analyseFilteredProps (phones, props) {
  let keys = Object.keys(props).filter(k => (!k.startsWith('Score')))
  keys.push('Score')
  keys.push('Score/Price ratio')
  for (let key of keys) {
    let minValue = undefined
    let maxValue = undefined
    for (var phone of phones) {
      var value = getValue(phone, key, props[key])
      if (value == null || value == undefined) {continue}
      if (minValue === undefined || value < minValue) {minValue = value}
      if (maxValue === undefined || value > maxValue) {maxValue = value}
    }
    props[key].minFilteredValue = minValue
    props[key].maxFilteredValue = maxValue
  }
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
    "RAM min",
    "Storage min",
    "nbRearCameraModules",
    "mainCameraMP",
    "mainCameraFocalLength",
    "mainCameraMaxAperture",
    "mainCameraSensorSize",
    "mainCameraPixelSize",
    "mainCameraHasOIS",
    "mainCameraHasPhaseDetection",
    "mainCameraHasOmniPhaseDetection",
    "teleCameraMP",
    "teleCameraFocalLength",
    "teleCameraOpticalZoom",
    "teleCameraMaxAperture",
    "teleCameraSensorSize",
    "teleCameraPixelSize",
    "teleCameraHasOIS",
    "teleCameraHasPhaseDetection",
    "teleCameraHasOmniPhaseDetection",
    "wideCameraMP",
    "wideCameraFocalLength",
    "wideCameraMaxAperture",
    "wideCameraSensorSize",
    "wideCameraPixelSize",
    "wideCameraHasOIS",
    "wideCameraHasPhaseDetection",
    "wideCameraHasOmniPhaseDetection",
    "nbFrontCameraModules",
    "selfieCameraMP",
    "selfieCameraFocalLength",
    "selfieCameraMaxAperture",
    "selfieCameraSensorSize",
    "selfieCameraPixelSize",
    "selfieCameraHasOIS",
    "selfieCameraHasPhaseDetection",
    "selfieCameraHasOmniPhaseDetection",
    "specs.maxFPS",
    "specs.batteryCapacity",
    "specs.enduranceRating",
    "specs.maxChargingPower",
    "specs.wirelessCharging",
    "specs.usbC",
  ]
  for (var key of allSpecKeys) {
    if (!allKeys.includes(key) && !["specs.memoryVersions", "specs.rearCameraModules", "specs.frontCameraModules"].includes(key)) {
      allKeys.push(key)
    }
  }
  return allKeys
}

function getScore(phone, k, kprops) {
  let value = getValue(phone, k, kprops)
  const min = kprops.minFilteredValue
  const max = kprops.maxFilteredValue
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
  let filters = []
  for (let k in keyProperties) {
    let p = keyProperties[k]
    if (p.filters['min'] && p.filters['min'] != p.minValue) {
      filters.push({key:k,type:'min',value:p.filters['min']})
    }
    if (p.filters['max'] && p.filters['max'] != p.maxValue) {
      filters.push({key:k,type:'max',value:p.filters['max']})
    }
    if (p.filters['keepEmpty'] == false) {
      filters.push({key:k,type:'keepEmpty',value:false})
    }
  }
  return filters
}

function getFilteredPhones(phones, keyProperties) {
  let filteredPhones = []
  let filters = getFilters(keyProperties)
  console.log(filters)
  for (let phone of phones) {
    let isFilteredOut = false
    for (let filter of filters) {
      let v = getValue(phone, filter.key, keyProperties[filter.key])
      let fv = filter.value
      switch (filter.type) {
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
        case 'keepEmpty':
          if (!fv && (v == undefined || v == null)) {
            isFilteredOut = true
          }
          break
      }
      if (isFilteredOut) {break}
    }
    if (!isFilteredOut) {
      filteredPhones.push(phone)
    }
  }
  analyseFilteredProps(filteredPhones, keyProperties)
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
var keyProperties = getKeyProperties()
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
    sortBestFirst: true,
    darktheme: true
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
      if (score == undefined) {return 'inherit'}
      let colorMap = [{score: 0, color: [180, 0, 0]},
                      {score: 0.5, color: [120, 120, 0]},
                      {score: 1, color: [0, 180, 60]} ]
      let color = [0,0,0]
      for (let j in colorMap) {
        if (j == 0) {continue}
        let r0 = colorMap[j-1].score
        let r1 = colorMap[j].score
        if (score >= r0 && score <= r1) {
          let c0 = colorMap[j-1].color
          let c1 = colorMap[j].color
          for (let ci in color) {
            let localscore = (score - r0) / (r1 - r0)
            color[ci] = c0[ci] + (c1[ci] - c0[ci]) * localscore + ((state.darktheme)?0:60)
          }
        }
      }
      return 'rgb(' + color.join() + ')'
    },
    getHeader: () => (k) => {
      if (!k) {return undefined}
      var spec = k.split('.').pop()
      return (spec[0].toUpperCase() + spec.slice(1))
        .replace(/[a-z][A-Z]/g, match => (match[0] + ' ' + match[1]))
        .replace('Nb ', 'Number of ')
        .replace('Ip ', 'IP ')
        .replace(/^Os$/, 'OS')
        .replace(' MP', ' MegaPixels')

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
             'Best : ' + (kprops.lowerIsBetter?kprops.minValue:kprops.maxValue) + '<br>' +
             'Worst: ' + (kprops.lowerIsBetter?kprops.maxValue:kprops.minValue) + '<br>' +
             'Filtered best : ' + (kprops.lowerIsBetter?kprops.minFilteredValue:kprops.maxFilteredValue) + '<br>' +
             'Filtered worst: ' + (kprops.lowerIsBetter?kprops.maxFilteredValue:kprops.minFilteredValue)

      return tooltip
    },
    getKeepEmpty: (state) => (k) => {
      if (!k) {return false}
      return state.keyProperties[k].filters['keepEmpty']
    },
    getFilters: (state) => {
      return getFilters(state.keyProperties)
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
      state.configPosX = p.posX
      state.configPosY = p.posY
    },
    applyFilter (state, p) {
      let key = p.key
      let filterType = p.filterType
      let filterValue = p.filterValue
      Vue.set(state.keyProperties[key].filters, filterType, filterValue)
      let filteredPhones = getFilteredPhones(state.allPhones, state.keyProperties)
      sortBy(filteredPhones, state.sortKey, state.sortBestFirst, state.keyProperties[state.sortKey])
      Vue.set(state, 'filteredPhones', filteredPhones)
    },
    removeFilter (state, filter) {
      console.log(filter)
      Vue.delete(state.keyProperties[filter.key].filters, filter.type)
      let filteredPhones = getFilteredPhones(state.allPhones, state.keyProperties)
      sortBy(filteredPhones, state.sortKey, state.sortBestFirst, state.keyProperties[state.sortKey])
      Vue.set(state, 'filteredPhones', filteredPhones)
    },
    setNbVisiblePhones (state, nb) {
      state.nbVisiblePhones = nb
    }
  }
})
