var request = require('request')
var cachedRequest = require('cached-request')(request)
var HTMLParser = require('node-html-parser')

cachedRequest.setCacheDirectory('./httpCache')

cachedRequest({uri: 'https://www.gsmarena.com/huawei_p40_pro+-10118.php',
               ttl: 1000*60*60*24*365*1000}, function (error, response, body) {
  if (error) {
    console.err(error)
  }
  if (response.headers['x-from-cache'] === 1) {
    console.log('from cache!')
  }

  var root = HTMLParser.parse(body)

  var specs = {}

  for (var el of root.querySelectorAll('.nfo')) {
    var dataSpec = el.getAttribute('data-spec')
    var label = el.parentNode.querySelector('.ttl').text
    var value = el.text

    console.log(dataSpec + ' (' + label + '): \t' + value)

    var key = dataSpec?dataSpec:label

    switch (key) {
      case 'displaytype':
        specs['hasOLED'] = value.match(/oled/i)?true:false
        break
      case 'os':
        if (value.includes('Android')) {
          specs['']
          specs['androidVersion'] = parseFloat(value.replace('Android ',''))
        }
        specs['hasGoogleServices'] = !value.includes('no Google Play Services')
        break
      case 'dimensions':
        var match = value.match(/(.*) x (.*) x (.*) mm/)
        specs['height'] = parseFloat(match[1])
        specs['width'] = parseFloat(match[2])
        specs['thickness'] = parseFloat(match[3])
        break
      case 'build':
        var front = value.match(/(.*) front/)[1]
        if (front.match(/gorilla/i)) {
          specs['gorillaGlassVersion'] = parseInt(front.match(/\d+/)[0])
        }
        break
      case 'weight':
        specs['weight'] = parseFloat(value)
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
        var coreGroups = [...value.matchAll(/(\d)x([\d.]+) GHz/g)]
        var nbCores = 0
        var maxClock = 0
        for (var coreGroup of coreGroups) {
          nbCores += parseInt(coreGroup[1])
          maxClock = Math.max(maxClock,parseFloat(coreGroup[2]))
        }
        specs['nbCores'] = nbCores
        specs['maxClock'] = maxClock
        break
      case 'chipset':
        specs['transistorSize'] = parseFloat(value.match(/([\d.]+) nm/)[1])
        break
      case 'displayresolution':
        var match = value.match(/([\d]+) x ([\d]+) pix/)
        specs['resolutionWidth'] = parseInt(match[1])
        specs['resolutionHeight'] = parseInt(match[2])
        match = value.match(/([\d.]+) ppi/)
        specs['ppi'] = parseFloat(match[1])
        break
      case 'displayother':
        specs['refreshRate'] = parseInt(value.match(/(\d+)Hz/)[1])
        break
    }

  }

  console.log(specs)

});
