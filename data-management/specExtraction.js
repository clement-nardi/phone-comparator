import HTMLParser from 'node-html-parser'

function extractSpecsFromBody(body) {

  var root = HTMLParser.parse(body)
  var specs = {'has5G': false}

  for (var el of root.querySelectorAll('.nfo')) {
    var dataSpec = el.getAttribute('data-spec')
    var label = el.parentNode.querySelector('.ttl').text
    var value = el.text

    //console.log(dataSpec + ' (' + label + '): \t' + value)

    var key = dataSpec?dataSpec:label
    var match

    switch (key) {
    case 'displaytype':
      specs['hasOLED'] = value.match(/oled/i)?true:false
      if (! specs['refreshRate']) {
        extractNumber(specs, 'refreshRate', value, /(\d+)Hz/, 1)
      }
      break
    case 'os':
      if (value.includes('Android')) {
        specs['os'] = 'Android'
        specs['androidVersion'] = parseFloat(value.replace('Android ',''))
        specs['hasGoogleServices'] = !value.includes('no Google Play Services')
      }
      break
    case 'dimensions':
      match = [...value.matchAll(/([\d.]+) x (.*) x (.*) mm/g)].pop()
      if (match) {
        specs['height'] = parseFloat(match[1])
        specs['width'] = parseFloat(match[2])
        specs['thickness'] = parseFloat(match[3])
      }
      break
    case 'build':
      extractNumber(specs, 'gorillaGlassVersion', value, /front \(Gorilla Glass ([\d.]+)/, 1)
      break
    case 'sim':
      specs['hasDualSim'] = value.match(/dual/i)?true:false
      break
    case 'net5g':
      specs['has5G'] = true
      break
    case 'status':
      match = value.match(/Released (\d+), (\w+)/)
      if (match) {
        let month_alpha = match[2]
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 
          'July', 'August', 'September', 'October', 'November', 'December']
        let month = 1 + months.indexOf(month_alpha)
        specs['releasedOn'] = {
          'year': parseInt(match[1]),
          'month': month
        }
      }
      break
    case 'weight':
      extractNumber(specs, 'weight', value, /([\d.]+)/, 1)
      break
    case 'bodyother':
      match = value.match(/IP(\d+)/)
      if (match) {
        specs['ipCertification'] = parseInt(match[1])
      }
      break
    case 'displaysize':
      specs['screenSize'] = parseFloat(value)
      specs['screenToBodyRatio'] = parseFloat(value.match(/([\d.]+%)/))
      break
    case 'cpu':
      var cpuVersions = [...value.matchAll(/\([^)]*\)/g)]
      if (cpuVersions.length == 0) {
        cpuVersions = [...value.matchAll(/\([^)]*/g)]
      }
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
      match = value.match(/([\d]+) x ([\d]+) pix/)
      if (match) {
        let res = [parseInt(match[1]),parseInt(match[2])]
        specs['resolutionWidth'] = Math.min(...res)
        specs['resolutionHeight'] = Math.max(...res)
      }
      extractNumber(specs, 'ppi', value, /([\d.]+) ppi/, 1)
      break
    case 'displayother':
      if (! specs['refreshRate']) {
        extractNumber(specs, 'refreshRate', value, /(\d+)Hz/, 1)
      }
      break
    case 'cam1modules':
      specs['rearCameraModules'] = extractCameraSpecs(value)
      break
    case 'cam2modules':
      specs['frontCameraModules'] = extractCameraSpecs(value)
      specs['frontCameraIsPopUp'] = value.includes('Motorized') || value.includes('pop-up')
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
  var modules = value.split('\r\n')
  var cameraSpecs = []
  for (var module of modules) {
    if (module == 'or') {break}
    cameraSpecs.push(extractCameraModuleSpecs(module))
  }
  return cameraSpecs
}

function extractCameraModuleSpecs(module) {
  var moduleSpecs = {}
  //console.log('cam module: ' + module)
  extractNumber(moduleSpecs, 'megapixels', module, /([\d.]+) ?MP/, 1)
  extractNumber(moduleSpecs, 'maxAperture', module, /f\/([\d.]+)/, 1)
  extractNumber(moduleSpecs, 'focalLength', module, /(\d+)mm/, 1)
  if (!moduleSpecs['focalLength']) {
    extractNumber(moduleSpecs, 'focalLength', module, /(\d+)˚/, 1)
    // convert to mm using tan
    moduleSpecs['focalLength'] = 24 / Math.tan(moduleSpecs['focalLength']/2*Math.PI/180)
  }
  extractNumber(moduleSpecs, 'opticalZoom', module, /([\d.]+)x optical/, 1)
  extractNumber(moduleSpecs, 'sensorSize', module, /1\/([\d.]+)"/, 1)
  moduleSpecs['sensorSize'] = 1/moduleSpecs['sensorSize']
  extractNumber(moduleSpecs, 'pixelSize', module, /([\d.]+)µm/, 1)
  moduleSpecs['autofocus'] = 
    module.includes('omnidirectional')?'omniPD':
      module.includes('PDAF')?'PD':undefined
  moduleSpecs['OIS'] = module.includes('OIS')
  return moduleSpecs
}

export {extractSpecsFromBody}