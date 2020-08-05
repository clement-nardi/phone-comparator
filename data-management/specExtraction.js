var HTMLParser = require('node-html-parser')

module.exports = {extractSpecsFromBody: extractSpecsFromBody}

function extractSpecsFromBody(body) {

  var root = HTMLParser.parse(body)
  var specs = {}

  for (var el of root.querySelectorAll('.nfo')) {
    var dataSpec = el.getAttribute('data-spec')
    var label = el.parentNode.querySelector('.ttl').text
    var value = el.text

    //console.log(dataSpec + ' (' + label + '): \t' + value)

    var key = dataSpec?dataSpec:label

    switch (key) {
      case 'displaytype':
        specs['hasOLED'] = value.match(/oled/i)?true:false
        break
      case 'os':
        if (value.includes('Android')) {
          specs['os'] = 'Android'
          specs['androidVersion'] = parseFloat(value.replace('Android ',''))
          specs['hasGoogleServices'] = !value.includes('no Google Play Services')
        }
        break
      case 'dimensions':
        var match = [...value.matchAll(/([\d.]+) x (.*) x (.*) mm/g)].pop()
        specs['height'] = parseFloat(match[1])
        specs['width'] = parseFloat(match[2])
        specs['thickness'] = parseFloat(match[3])
        break
      case 'build':
          extractNumber(specs, 'gorillaGlassVersion', value, /front \(Gorilla Glass ([\d.]+)/, 1)
        break
      case 'weight':
        extractNumber(specs, 'weight', value, /([\d.]+)/, 1)
        break
      case 'bodyother':
        var match = value.match(/IP(\d+)/)
        if (match) {
          specs['ipCertification'] = parseInt(match[1])
        }
        break;
      case 'displaysize':
        specs['screenSize'] = parseFloat(value)
        specs['screenToBodyRatio'] = parseFloat(value.match(/([\d.]+%)/))
        break
      case 'cpu':
        var cpuVersions = [...value.matchAll(/\([^)]*\)/g)]
        if (cpuVersions.length > 0) {
          var coreGroups = [...cpuVersions[0][0].matchAll(/(\d)x([\d.]+) GHz/g)]
          var nbCores = 0
          var maxClock = 0
          for (var coreGroup of coreGroups) {
            nbCores += parseInt(coreGroup[1])
            maxClock = Math.max(maxClock,parseFloat(coreGroup[2]))
          }
          if (nbCores) {specs['nbCores'] = nbCores}
          if (maxClock) {specs['maxClock'] = maxClock}
        }
        break
      case 'chipset':
        extractNumber(specs, 'transistorSize', value, /([\d.]+) nm/, 1)
        break
      case 'displayresolution':
        var match = value.match(/([\d]+) x ([\d]+) pix/)
        if (match) {
          specs['resolutionWidth'] = parseInt(match[1])
          specs['resolutionHeight'] = parseInt(match[2])
        }
        extractNumber(specs, 'ppi', value, /([\d.]+) ppi/, 1)
        break
      case 'displayother':
        extractNumber(specs, 'refreshRate', value, /(\d+)Hz/, 1)
        break
      case 'cam1modules':
        specs['rearCameraModules'] = extractCameraSpecs(value)
        break
      case 'cam2modules':
        specs['frontCameraModules'] = extractCameraSpecs(value)
        break
      case 'usb':
        specs['usbC'] = value.includes('Type-C')
        break
      case 'batdescription1':
        extractNumber(specs, 'batteryCapacity', value, /(\d+) mAh/, 1)
        break
      case 'Charging':
        extractNumber(specs, 'maxChargingPower', value, /(\d+)W/, 1)
        specs['wirelessCharging'] = value.includes('wireless')
        break
      case 'batlife':
        specs['enduranceRating'] = parseInt(value.match(/Endurance rating (\d+)h/)[1])
        break
      case 'internalmemory':
        var memoryVersions = [...value.matchAll(/([\d.]+)GB ([\d.]+)GB RAM/g)]
        specs['memoryVersions'] = []
        for (var version of memoryVersions) {
          specs['memoryVersions'].push({'RAM': version[2], 'storage': version[1]})
        }
        specs['memoryVersions'].sort((a,b)=>{
          if (a.RAM != b.RAM) {
            return a.RAM - b.RAM
          } else {
            return a.storage - b.storage
          }
        })
        break
      case 'cam1video':
        var maxFps = 0
        for (var fpsMatch of value.matchAll(/(\d+)fps/g)) {
          maxFps = Math.max(maxFps,parseInt(fpsMatch[1]))
        }
        if (maxFps>0) {specs['maxFPS'] = maxFps}
        break


    }

  }

  return specs
}

function extractNumber(obj, propertyName, value, pattern, index) {
  var match = value.match(pattern)
  if (match) {
    obj[propertyName] = parseFloat(match[index])
  }
}

function extractCameraSpecs(value) {
    var modules = value.split('\n')
    var cameraSpecs = []
    for (var module of modules) {
      cameraSpecs.push(extractCameraModuleSpecs(module))
    }
    return cameraSpecs
}

function extractCameraModuleSpecs(module) {
  var moduleSpecs = {}
  //console.log('cam module: ' + module)
  var match
  if (match = module.match(/([\d.]+) MP/)) { moduleSpecs['megapixels'] = parseFloat(match[1]) }
  if (match = module.match(/f\/([\d.]+)/)) { moduleSpecs['maxAperture'] = parseFloat(match[1]) }
  if (match = module.match(/(\d+)mm/)) { moduleSpecs['focalLength'] = parseFloat(match[1]) }
  if (match = module.match(/([\d.]+)x optical/)) { moduleSpecs['opticalZoom'] = parseFloat(match[1]) }
  if (match = module.match(/1\/([\d.]+)"/)) { moduleSpecs['sensorSize'] = 1/parseFloat(match[1]) }
  if (match = module.match(/([\d.]+)µm/)) { moduleSpecs['pixelSize'] = parseFloat(match[1]) }
  moduleSpecs['autofocus'] = module.includes('omnidirectional')?'omniPD':
                             module.includes('PDAF')?'PD':undefined
  moduleSpecs['OIS'] = module.includes('OIS')
  return moduleSpecs
}
