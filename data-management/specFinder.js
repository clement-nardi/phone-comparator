import {fetchBodyWithCache} from './httpCache.js'
import HTMLParser from 'node-html-parser'

function findAllSpecs(phoneList) {
  var count = 0
  var promises = []
  for (var phone of phoneList) {
    promises.push(findSpecs(phone))
  }
  return Promise.all(promises)
}

function findSpecs(phone) {
  var name = phone.name
  var names = [name]
  if (name.includes(' - ')) {
    names = names.concat(name.split(' - '))
  }
  for (var pattern of [/(.*) \(.*\)/, /(.*) Dual Sim/i]) {
    let match = name.match(pattern)
    if (match) {
      names.push(match[1])
    }
  }
  return findSpecsRec(names,0,[])
  .then(specs => {
    for (var spec of specs) {
      rateSpec(spec, names)
    }
    phone['searchResults'] = specs.sort((a,b) => {return b.score - a.score})
    return phone
  })
}

function rateSpec(spec, names) {
  spec.score = 0
  for (var i in names) {
    if (strEqual(spec.name, names[i])) {
      spec.score = 100 - i
      return
    }
    var match = spec.name.match(/(Samsung) (.*)/i)
    if (match && strEqual(match[2], names[i])) {
      spec.score = 90 - i
      return
    }
    var match = names[i].match(/(.*)(GT-)(.*)/i)
    if (match && strEqual(spec.name, match[1] + match[3])) {
      spec.score = 90 - i
      return
    }
    var match = spec.name.match(/(.*) (20\d\d|5G|\(20\d\d*\)|4G|classic|AI Dual Camera|dual sim|ThinQ)/i)
    if (match && strEqual(match[1], names[i])) {
      spec.score = 80 - i
      return
    }
    var match = spec.name.match(/(.*) (\(.*\))/i)
    if (match && strEqual(match[1], names[i])) {
      spec.score = 60 - i
      return
    }

  }
}

function strEqual(str1, str2) {
  return stripStr(str1) == stripStr(str2)
}

function stripStr(str) {
  return str.replace(/[ \-()]/g, '').toLowerCase()
}

function findSpecsRec(names, i, best) {
  if (i >= names.length) { return best }
  return searchSpecs(names[i])
  .then(results => {
    //console.log('try ' + (i+1) + '/' + names.length + ': ' + names[i])
    //console.log(results)
    if (results.length === 1) {
      return results
    } else if (results.length === 0) {
      return findSpecsRec(names, i+1, best)
    } else {
      if (results.length < best.length || best.length === 0) {
        best = results
      }
      return findSpecsRec(names, i+1, best)
    }
  })
}

function searchSpecs(name) {
  var sSearch = encodeURIComponent(name).replace(/%20/g, '+')
  return fetchBodyWithCache('https://www.gsmarena.com/results.php3?sQuickSearch=yes&sName=' + sSearch)
  .then(body => {
    return analyseSearchResults(body)
  })
}

function analyseSearchResults(body) {
  var root = HTMLParser.parse(body)
  var results = []

  for (var el of root.querySelectorAll('.makers')) {
    var ul = el.parentNode.querySelector('ul')
    if (el.parentNode.tagName == 'html' || !ul) {
      return results
    }

    for (var li of ul.querySelectorAll('li')) {
      var name = li.structuredText.replace('\n', ' ')
      var link = li.querySelector('a').getAttribute('href')
      results.push({name:name, link:link})
    }
  }
  return results
}


export {
  findAllSpecs,
  findSpecs,
  searchSpecs
}