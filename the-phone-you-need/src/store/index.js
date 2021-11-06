import Vue from 'vue'
import Vuex from 'vuex'
import allPhones from '../../../data-management/allSpecs.json'
import patch from '../../../data-management/patch.json'

Vue.use(Vuex)


function applyPatch() {
  let phonesPerName = {}
  for (let phone of allPhones) {
    phonesPerName[phone['name']] = phone
  }

  for (let p in patch) {
    console.log('applying patch to ' + p)
    let ph = phonesPerName[p]
    let pa = patch[p]
    if (ph) {
      patchObject(ph, pa)
    } else {
      console.log('unknown phone..')
    }
  }
}


function patchObject(object, patch) {
  for (let id in patch) {
    if (typeof patch[id] !== 'object') {
      object[id] = patch[id]
    } else {
      patchObject(object[id], patch[id])
    }
  }
}

applyPatch()


const scoresAreAbsolute = true

/* This array determines the columns order and the various headers*/
const sortedKeysWithCategories = [
  { key: 'brand', categories: ['Designation'] },
  { key: 'name', categories: ['Designation'] },
  { key: 'releaseDate', categories: ['Designation'] },
  { key: 'price', categories: ['Pricing'] },
  { key: 'nbOffers', categories: ['Pricing'] },
  { key: 'Score', categories: ['Score'] },
  { key: 'Score/Price ratio', categories: ['Score'] },
  { key: 'specs.height', categories: ['Specifications', 'Body'] },
  { key: 'specs.width', categories: ['Specifications', 'Body'] },
  { key: 'specs.thickness', categories: ['Specifications', 'Body'] },
  { key: 'specs.weight', categories: ['Specifications', 'Body'] },
  { key: 'specs.ipCertification', categories: ['Specifications', 'Body'] },
  { key: 'specs.gorillaGlassVersion', categories: ['Specifications', 'Body'] },
  { key: 'specs.screenSize', categories: ['Specifications', 'Screen'] },
  { key: 'specs.screenToBodyRatio', categories: ['Specifications', 'Screen'] },
  { key: 'specs.hasOLED', categories: ['Specifications', 'Screen'] },
  { key: 'specs.resolutionWidth', categories: ['Specifications', 'Screen'] },
  { key: 'specs.resolutionHeight', categories: ['Specifications', 'Screen'] },
  { key: 'specs.ppi', categories: ['Specifications', 'Screen'] },
  { key: 'specs.refreshRate', categories: ['Specifications', 'Screen'] },
  { key: 'specs.os', categories: ['Specifications', 'Software'] },
  { key: 'specs.androidVersion', categories: ['Specifications', 'Software'] },
  { key: 'specs.hasGoogleServices', categories: ['Specifications', 'Software'] },
  { key: 'specs.nbCores', categories: ['Specifications', 'Hardware', 'CPU'] },
  { key: 'specs.maxClock', categories: ['Specifications', 'Hardware', 'CPU'] },
  { key: 'specs.transistorSize', categories: ['Specifications', 'Hardware', 'CPU'] },
  { key: 'RAM min', categories: ['Specifications', 'Hardware', 'RAM'] },
  { key: 'RAM max', categories: ['Specifications', 'Hardware', 'RAM'] },
  { key: 'Storage min', categories: ['Specifications', 'Hardware', 'Storage'] },
  { key: 'Storage max', categories: ['Specifications', 'Hardware', 'Storage'] },
  { key: 'nbRearCameraModules', categories: ['Specifications', 'Rear Cameras'] },
  { key: 'mainCamera.MP', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.FocalLength', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.MaxAperture', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.SensorSize', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.PixelSize', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.HasOIS', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.HasPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'mainCamera.HasOmniPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'specs.maxFPS', categories: ['Specifications', 'Rear Cameras', 'Main Camera'] },
  { key: 'teleCamera.MP', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.FocalLength', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.OpticalZoom', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.MaxAperture', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.SensorSize', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.PixelSize', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.HasOIS', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.HasPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'teleCamera.HasOmniPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 1'] },
  { key: 'tele2Camera.MP', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.FocalLength', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.OpticalZoom', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.MaxAperture', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.SensorSize', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.PixelSize', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.HasOIS', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.HasPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'tele2Camera.HasOmniPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Zoom Camera 2'] },
  { key: 'wideCamera.MP', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.FocalLength', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.MaxAperture', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.SensorSize', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.PixelSize', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.HasOIS', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.HasPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'wideCamera.HasOmniPhaseDetection', categories: ['Specifications', 'Rear Cameras', 'Wide Angle Camera'] },
  { key: 'nbFrontCameraModules', categories: ['Specifications', 'Selfie Cameras'] },
  { key: 'specs.frontCameraIsPopUp', categories: ['Specifications', 'Selfie Cameras'] },
  { key: 'selfieCamera.MP', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.FocalLength', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.MaxAperture', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.SensorSize', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.PixelSize', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.HasOIS', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.HasPhaseDetection', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'selfieCamera.HasOmniPhaseDetection', categories: ['Specifications', 'Selfie Cameras', 'Selfie Camera 1'] },
  { key: 'specs.batteryCapacity', categories: ['Specifications', 'Battery'] },
  { key: 'specs.enduranceRating', categories: ['Specifications', 'Battery'] },
  { key: 'specs.maxChargingPower', categories: ['Specifications', 'Battery'] },
  { key: 'specs.wirelessCharging', categories: ['Specifications', 'Battery'] },
  { key: 'specs.has5G', categories: ['Specifications', 'Connectivity'] },
  { key: 'specs.hasDualSim', categories: ['Specifications', 'Connectivity'] },
  { key: 'specs.usbC', categories: ['Specifications', 'Connectivity'] },
  { key: 'cameraReview.mobile.overallScore' },
  { key: 'cameraReview.mobile.zoom.overallScore' },
  { key: 'cameraReview.mobile.zoom.tele' },
  { key: 'cameraReview.mobile.zoom.wide' },
  { key: 'cameraReview.mobile.photo.overallScore' },
]

var keyWeights  = {
  '_default_': 0,
  'Specifications': {
    '_default_':10,
    'Hardware': {
      'RAM': {'RAM max':2,'RAM min':8},
      'Storage':{'Storage max':1,'Storage min':2},
      'CPU':{'specs.nbCores':4,'specs.maxClock':4}
    },
    'Rear Cameras': {
      'Wide Angle Camera': {'_default_':2,'wideCamera.MP':3,'wideCamera.FocalLength':3,'wideCamera.MaxAperture':4,'wideCamera.SensorSize':4},
      'nbRearCameraModules':6,
      'Main Camera': {'_default_':2,'mainCamera.SensorSize':8,'mainCamera.FocalLength':0,'mainCamera.MaxAperture':6,'mainCamera.HasOIS':7,'mainCamera.MP':4,'specs.maxFPS':10},
      'Zoom Camera 1': {'_default_':3,'teleCamera.MP':5,'teleCamera.FocalLength':7,'teleCamera.OpticalZoom':10,'teleCamera.MaxAperture':8,'teleCamera.SensorSize':8,'teleCamera.HasOIS':6},
      'Zoom Camera 2': {'_default_':1,'tele2Camera.MP':2,'tele2Camera.FocalLength':4,'tele2Camera.OpticalZoom':5,'tele2Camera.MaxAperture':4,'tele2Camera.SensorSize':4,'tele2Camera.HasOIS':3}
    },
    'Selfie Cameras': {
      '_default_':8,
      'specs.frontCameraIsPopUp': 10,
      'Selfie Camera 1':{'_default_':3,'selfieCamera.MP':5,'selfieCamera.FocalLength':0,'selfieCamera.MaxAperture':6,'selfieCamera.SensorSize':6,'selfieCamera.HasOIS':5}
    },
    'Battery':{'specs.maxChargingPower':6,'specs.wirelessCharging':2},
    'Body':{'_default_':1,'specs.thickness':4,'specs.weight':4,'specs.ipCertification':4,'specs.gorillaGlassVersion':4},
    'Screen':{'_default_':1,'specs.screenToBodyRatio':10,'specs.hasOLED':8},
    'Software':{'specs.hasGoogleServices':5},
    'Connectivity':{'specs.usbC':5}
  }
}

function getKeyCategories(key, kprops) {
  let categories = null
  if (kprops && kprops['categories']) {
    categories = kprops['categories']
  } else {
    categories = key.split('.')
    categories.pop()
  }
  return categories
}


function getKeyWeight(keyWeights, key, kprops) {
  let path = [...getKeyCategories(key, kprops)]
  path.push(key)
  return getWeight(keyWeights, path)
}

function getWeight(keyWeights, path) {
  let currentWeightObject = keyWeights
  let currentWeight = 0
  for (let pathElement of [...path, '_fake_']) {
    if (typeof currentWeightObject === 'object') {
      if (currentWeightObject['_default_']) {
        currentWeight = currentWeightObject['_default_']
      }
      if (Object.prototype.hasOwnProperty.call(currentWeightObject, pathElement)) {
        currentWeightObject = currentWeightObject[pathElement]
      } else {
        break
      }
    } else {
      currentWeight = currentWeightObject
      break
    }
  }
  //console.log('getWeigth([' + path.join(', ') + ']) = ' + currentWeight)
  return currentWeight
}


function setKeyWeight(keyWeights, key, kprops, weight) {
  let path = [...getKeyCategories(key, kprops)]
  path.push(key)
  return setWeight(keyWeights, path, weight)
}

function setWeight(keyWeights, path_, weight) {
  let currentWeightObject = keyWeights
  let path = [...path_]
  let last = path.pop()
  for (let pathElement of path) {    
    if (!currentWeightObject[pathElement]) {
      Vue.set(currentWeightObject, pathElement, {})
    } 
    if (typeof currentWeightObject[pathElement] !== 'object') {
      Vue.set(currentWeightObject, pathElement, {
        _default_: currentWeightObject[pathElement]
      })
    }
    currentWeightObject = currentWeightObject[pathElement]
  }
  if (typeof currentWeightObject[last] === 'object') {
    Vue.set(currentWeightObject[last], '_default_', parseInt(weight))
  } else {
    Vue.set(currentWeightObject, last, parseInt(weight))
  }  
}

const excludedKeys = [
  'specs.memoryVersions', 
  'specs.rearCameraModules', 
  'specs.frontCameraModules',
  'cameraReview.name',
  'cameraReview.mobile.link',
  'cameraReview.selfie.link',
  'cameraReview.audio.link',
  'cameraReview.display.link',
  'link',
  'specs.releasedOn.year',
  'specs.releasedOn.month'
]


function getKeysFromPhones(allPhones) {
  var allKeys = new Set()
  for (var phone of allPhones) {
    allKeys = new Set([...getKeysFromObject(phone), ...allKeys])
  }
  console.log([...allKeys])
  return [...allKeys]
}

function getKeysFromObject(object) {
  let keys = new Set()
  getKeysFromObjectRec(object, '', keys)
  return keys
}

function getKeysFromObjectRec(object, prefix, keySet) {
  for (let key of Object.keys(object)) {
    let prop = object[key]
    // console.log(key)
    if (Array.isArray(prop) || prop === null || prop === undefined) {
      continue
    } else if (typeof prop === 'object') {
      getKeysFromObjectRec(prop, prefix + key + '.', keySet)
    } else {
      keySet.add(prefix + key)
    }
  }
}

function wordify(word) {
  return (word[0].toUpperCase() + word.slice(1))
    .replace(/[a-z][A-Z]/g, match => (match[0] + ' ' + match[1]))
    .replace('Nb ', 'Number of ')
    .replace('Ip ', 'IP ')
    .replace(/^Os$/, 'OS')
    .replace(' MP', ' MegaPixels')
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

function getKeyProperties(scoresAreAbsolute) {
  var props = {}
  for (var v of allKeys) {
    props[v] = {filters: {keepEmpty: true}}
  }
  props['name']['width'] = '100px'
  props['releaseDate']['width'] = '46px'
  props['releaseDate']['getLabel'] = (phone) => {
    if (phone['specs']) {
      const date = phone['specs']['releasedOn']
      if (date) {
        return date['year'] + '/' + date['month'].toString().padStart(2, '0')
      }
    }
    return ''
  }
  props['releaseDate']['getValue'] = (phone) => {
    if (phone['specs']) {
      const date = phone['specs']['releasedOn']
      if (date) {
        return date['year'] * 12 + date['month']
      }
    }
    return undefined
  }
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
  for (var k of ['height', 'width', 'thickness', 'weight', 'transistorSize', 'frontCameraIsPopUp']) {
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

  props['RAM max']['getValue'] = (phone) => {
    if (phone.specs && phone.specs.memoryVersions && phone.specs.memoryVersions.length>0) {
      return Math.max(...((phone.specs.memoryVersions).map(m => m.RAM)))
    } else {
      return undefined
    }
  }
  props['Storage max']['getValue'] = (phone) => {
    if (phone.specs && phone.specs.memoryVersions && phone.specs.memoryVersions.length>0) {
      return Math.max(...((phone.specs.memoryVersions).map(m => m.storage)))
    } else {
      return undefined
    }
  }

  /* Camera Properties */

  let modules = ['main', 'tele', 'tele2', 'wide', 'selfie']
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
    let cam2 = undefined
    for (let pm of phone.specs.rearCameraModules.slice(1)) {
      let mfl = 24
      if (phone.specs.rearCameraModules[0].focalLength) {mfl = phone.specs.rearCameraModules[0].focalLength}
      let fl = undefined
      if (mod.includes('tele')) {
        if (pm.focalLength) {
          fl = pm.focalLength
        } else if (pm.opticalZoom) {
          fl = mfl * pm.opticalZoom
        }
        if (!fl) {continue}
        if (fl > mfl) {
          if (cam == undefined) {
            cam = pm
          } else if (fl > cam.focalLength) {
            cam2 = cam
            cam = pm
          } else {
            cam2 = pm
          }
        }
      } else { // mod == 'wide'
        if (pm.focalLength < mfl) {
          if (cam == undefined || pm.focalLength < cam.focalLength) {
            cam = pm
          }
        }
      }
    }
    if (mod.includes('2')) {
      return cam2
    } else {
      return cam
    }
  }

  for (let mod of modules) {
    for (let spec of camSpecs) {
      let k = mod + 'Camera.' + spec
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
          if (!pm.focalLength && pm.opticalZoom) {
            return pm.opticalZoom * 25.98751
          }
          return pm.focalLength
        case 'OpticalZoom':
          if (pm.focalLength && !pm.opticalZoom) {
            return pm.focalLength / 25.98751
          }
          return pm.opticalZoom
        case 'MaxAperture':
          return pm.maxAperture
        case 'SensorSize':
          if (!pm.sensorSize && pm.pixelSize && pm.megapixels) {
            return pm.pixelSize * Math.sqrt(pm.megapixels) / 12.0553
          }
          return pm.sensorSize
        case 'PixelSize':
          if (pm.sensorSize && !pm.pixelSize && pm.megapixels) {
            return pm.sensorSize / Math.sqrt(pm.megapixels) * 12.0553
          }
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

  props['wideCamera.FocalLength']['lowerIsBetter'] = true
  props['mainCamera.FocalLength']['lowerIsBetter'] = true
  props['selfieCamera.FocalLength']['lowerIsBetter'] = true

  props['nbRearCameraModules']['getValue'] = (phone) => {
    if (!phone.specs || !phone.specs.rearCameraModules) {return 0}
    return phone.specs.rearCameraModules.length
  }
  props['nbFrontCameraModules']['getValue'] = (phone) => {
    if (!phone.specs || !phone.specs.frontCameraModules) {return 0}
    return phone.specs.frontCameraModules.length
  }


  /* Small columns: 1 figure */
  let smallColumns = [
    'specs.gorillaGlassVersion', 
    'specs.os', 
    'specs.nbCores', 
    'nbRearCameraModules', 
    'nbFrontCameraModules'
  ]
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
    'RAM max',
    'mainCamera.FocalLength',
    'teleCamera.MP',
    'tele2Camera.MP',
    'wideCamera.MP',
    'wideCamera.FocalLength',
    'selfieCamera.MP',
    'selfieCamera.FocalLength',
    'specs.maxChargingPower'
  ]
  for (let key of mediumColumns) {
    props[key].width = '16px'
  }
  /* 2 figures and a '.' */
  let mediumColumns2 = [
    'specs.thickness', 
    'mainCamera.MaxAperture', 
    'teleCamera.MaxAperture', 
    'tele2Camera.MaxAperture', 
    'teleCamera.OpticalZoom', 
    'tele2Camera.OpticalZoom', 
    'wideCamera.MaxAperture', 
    'selfieCamera.MaxAperture'
  ]
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

  props['Score/Price ratio']['getValue'] = phone => {
    return phone['Score'] / phone.price * 100
  }

  /* Headers */
  for (let keyWithCats of sortedKeysWithCategories) {
    if (props[keyWithCats.key]) {
      props[keyWithCats.key]['categories'] = keyWithCats.categories
    }
  }

  if (scoresAreAbsolute) {
    computeAllScores(allPhones, props, keyWeights, scoresAreAbsolute)
  }

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
  const allKeys = getKeysFromPhones(allPhones)

  let sortedKeys = sortedKeysWithCategories.map(kc => kc.key)

  for (var key of allKeys) {
    if (!sortedKeys.includes(key)) {
      if (!excludedKeys.includes(key)) {
        console.log('additional key: ' + key)
        sortedKeys.push(key)
      } else {
        console.log('filtered-out key: ' + key)
      }
    }
  }
  return sortedKeys
}

function computeAllScores(phones, props, keyWeights, scoresAreAbsolute) {
  for (let phone of phones) {
    phone['Score'] = getPhoneScore(phone, props, keyWeights, scoresAreAbsolute)
  }
  analysePropValues(props, 'Score')
  analysePropValues(props, 'Score/Price ratio')
}
/*
function getTheoreticalMaxScore(props) {
  let phoneScore = 0
  for (let key of allKeys) {
    if (key == 'Score' || key == 'Score/Price ratio') {continue}
    let kprops = props[key]
    let type = getType(kprops.types)
    if (type == 'number' || type == 'boolean') {
      let weight = getKeyWeight(keyWeights, key, kprops)
      phoneScore += weight
    }
  }
  return phoneScore
}*/

function getPhoneScore(phone, props, keyWeights, scoresAreAbsolute) {
  let phoneScore = 0
  for (let key of allKeys) {
    if (key == 'Score' || key == 'Score/Price ratio') {continue}
    let kprops = props[key]
    let type = getType(kprops.types)
    if (type == 'number' || type == 'boolean') {
      let keyScore = getScore(phone, key, kprops, scoresAreAbsolute)
      if (typeof keyScore == 'number') {
        if (isNaN(keyScore)) {
          console.log(key)
        }
        let weight = getKeyWeight(keyWeights, key, kprops)
        phoneScore += keyScore * weight
      }
    }
  }
  return phoneScore
}

function getScore(phone, k, kprops, scoresAreAbsolute) {
  let value = getValue(phone, k, kprops)
  let min
  let max
  if (scoresAreAbsolute) {
    min = kprops.minValue
    max = kprops.maxValue
  } else {
    min = kprops.minFilteredValue
    max = kprops.maxFilteredValue
  }
  if (! (max-min) || value == undefined) {
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
    if (Object.prototype.hasOwnProperty.call(p.filters, 'min') && p.filters['min'] != p.minValue) {
      filters.push({key:k,type:'min',value:p.filters['min']})
    }
    if (Object.prototype.hasOwnProperty.call(p.filters, 'max') && p.filters['max'] != p.maxValue) {
      filters.push({key:k,type:'max',value:p.filters['max']})
    }
    if (p.filters['keepEmpty'] == false) {
      filters.push({key:k,type:'keepEmpty',value:false})
    }
  }
  return filters
}

function getFilteredPhones(phones, keyProperties, keyWeights, scoresAreAbsolute) {
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

  if (!scoresAreAbsolute) {
    computeAllScores(allPhones, keyProperties, keyWeights, scoresAreAbsolute)
  }

  return filteredPhones
}

function sortBy(phones, key, bestFirst, kprops) {
  var coef = (kprops.lowerIsBetter?-1:1) * (bestFirst?1:-1)
  /* this way, empty values are shown at the top when requesting 'see worst first' */
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
var keyProperties = getKeyProperties(scoresAreAbsolute)
var filteredPhones = getFilteredPhones(allPhones, keyProperties, keyWeights, scoresAreAbsolute)
sortBy(filteredPhones, 'Score', true, keyProperties['Score'])

export default new Vuex.Store({
  state: {
    allPhones: allPhones,
    keyProperties: keyProperties,
    filteredPhones: filteredPhones,
    keyWeights: keyWeights,
    nbVisiblePhones: 100,
    allKeys: allKeys,
    configKey: null,
    configPos: 0,
    sortKey: 'Score',
    sortBestFirst: true,
    darktheme: true,
    scoresAreAbsolute: scoresAreAbsolute,
    displayWeightEditor: false
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
      let colorMap = [
        {score: 0, color: [180, 0, 0]},
        {score: 0.5, color: [120, 120, 0]},
        {score: 1, color: [0, 180, 60]} 
      ]
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
    getColumnBackgroundColor: (state) => (key) => {
      let w = getKeyWeight(state.keyWeights, key, state.keyProperties[key])
      if (w > 0) {
        return 'rgb(' + [
          5*w + ((state.darktheme)?0:60), 
          5*w + ((state.darktheme)?0:60), 
          195*w/10 + ((state.darktheme)?0:60)
        ].join() + ')'
      } else {
        return 'inherit'
      }
    },
    getKeyCategories: (state) => (key) => {
      return getKeyCategories(key, state.keyProperties[key])
    },
    getKeyWeight: (state) => (key) => {
      return getKeyWeight(state.keyWeights, key, state.keyProperties[key])
    },
    getWeight: (state) => (path) => {
      return getWeight(state.keyWeights, path)
    },
    /* returns a matrix of header objects {title, colSpan, rowSpan} */
    getHeaderLevels: (state) => {
      let levels = []
      let n
      for (n = 1; n <=3; n += 1) {
        let previousHeader = '$fake$'
        let previousPath = []
        let allKeys = [...state.allKeys]
        allKeys.push('$fake$')
        let keyCount = 0
        let headers = []
        for (let key of allKeys) {
          let header = ''
          let categories = getKeyCategories(key, state.keyProperties[key])
          if (categories.length >= n) {
            header = categories[n-1]
          }
          if (previousHeader == '$fake$') {
            /* first key only */ 
            previousHeader = header
            previousPath = categories.slice(0, n)
          } else if (header != previousHeader) {
            headers.push({
              title: previousHeader,
              colSpan: keyCount,
              rowSpan: 1,
              path: previousPath
            })
            previousHeader = header
            previousPath = categories.slice(0, n)
            keyCount = 0
          }
          keyCount += 1
        }
        console.log(headers)
        levels.push(headers)
      }
      
      /* merge empty layers with above layers */
      for (n = 2; n >=1; n -= 1) {
        let aboveIdx = 0
        let aboveKeyIdx = 0
        let currentIdx = 0
        let currentKeyIdx = 0
        while (aboveIdx < levels[n-1].length && currentIdx < levels[n].length) {
          let above = levels[n-1][aboveIdx]
          let current = levels[n][currentIdx]
          if (currentKeyIdx < aboveKeyIdx || current.title != '') {
            currentIdx += 1
            currentKeyIdx += current.colSpan
          } else if (currentKeyIdx > aboveKeyIdx) {
            aboveIdx += 1
            aboveKeyIdx += above.colSpan
          } else { // currentKeyIdx == aboveKeyIdx AND current.title == ''
            if (current.colSpan >= above.colSpan) {
              above.rowSpan += current.rowSpan
              aboveIdx += 1
              aboveKeyIdx += above.colSpan
              current.colSpan -= above.colSpan
              currentKeyIdx += above.colSpan
              if (current.colSpan == 0) {
                levels[n].splice(currentIdx, 1)
              }
            } else {
              currentIdx += 1
              currentKeyIdx += current.colSpan
            }
          }
        }
      }

      return levels
    },
    getHeader: () => (k) => {
      if (!k) {return undefined}
      var spec = k.split('.').pop()
      return wordify(spec)
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
      //var title = k.split('.').map(w => wordify(w)).join(' ')
      var title = getters.getHeader(k)
      var tooltip = title + '<br>' +
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
      let filteredPhones = getFilteredPhones(state.allPhones, state.keyProperties, state.keyWeights, state.scoresAreAbsolute)
      sortBy(filteredPhones, state.sortKey, state.sortBestFirst, state.keyProperties[state.sortKey])
      Vue.set(state, 'filteredPhones', filteredPhones)
    },
    removeFilter (state, filter) {
      console.log(filter)
      Vue.delete(state.keyProperties[filter.key].filters, filter.type)
      let filteredPhones = getFilteredPhones(state.allPhones, state.keyProperties, state.keyWeights, state.scoresAreAbsolute)
      sortBy(filteredPhones, state.sortKey, state.sortBestFirst, state.keyProperties[state.sortKey])
      Vue.set(state, 'filteredPhones', filteredPhones)
    },
    setNbVisiblePhones (state, nb) {
      state.nbVisiblePhones = nb
    },
    displayWeightEditor (state) {
      state.displayWeightEditor = true
    },
    hideWeightEditor (state) {
      state.displayWeightEditor = false
    },
    setKeyWeight: (state, p) => {
      setKeyWeight(state.keyWeights, p.key, state.keyProperties[p.key], p.weight)
    },
    setWeight: (state, p) => {
      setWeight(state.keyWeights, p.path, p.weight)
    },
    updateScores: (state) => {
      computeAllScores(state.allPhones, state.keyProperties, state.keyWeights, state.scoresAreAbsolute)
    }
  }
})
