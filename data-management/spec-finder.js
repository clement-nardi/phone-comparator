var {fetchBodyWithCache} = require('./httpCache')
var HTMLParser = require('node-html-parser')

module.exports = {
  findAllSpecs: findAllSpecs,
  findSpecs: findSpecs
}

function findAllSpecs(phoneList) {
  var count = 0
  for (var phone of phoneList) {
    const name = phone.name
    findSpecs(name)
    .then(specs => {
      if (specs.length == 0 ||
          (specs.length > 1 && specs[0].score == specs[1].score) ) {
        //console.log(name)
        //console.log(specs)
      } else {
        //fetchBodyWithCache('https://www.gsmarena.com/' + specs[0].link)
      }
      for (var spec of specs) {
        fetchBodyWithCache('https://www.gsmarena.com/' + spec.link)
      }
    })
    if (count++ > 10) {
      //return
    }
  }
}

function findSpecs(name) {
  var names = [name]
  if (name.includes(' - ')) {
    names = names.concat(name.split(' - '))
  }
  return findSpecsRec(names,0,[])
  .then(specs => {
    for (var spec of specs) {
      rateSpec(spec, names)
    }
    return specs.sort((a,b) => {return b.score - a.score})
  })
}

function rateSpec(spec, names) {
  spec.score = 0
  for (var i in names) {
    if (strEqual(spec.name, names[i])) {
      spec.score = 10 * (10-i)
      return
    }
  }
}

function strEqual(str1, str2) {
  return stripStr(str1) == stripStr(str2)
}

function stripStr(str) {
  return str.replace(/[ -()]/g, '').toLowerCase()
}

findSpecsRec = (names, i, best) => {
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

searchSpecs = (name) => {
  var sSearch = encodeURIComponent(name).replace(/%20/g, '+')
  return fetchBodyWithCache('https://www.gsmarena.com/res.php3?sSearch=' + sSearch)
  .then(body => {
    return analyseSearchResults(body)
  })
}

analyseSearchResults = (body) => {
  var root = HTMLParser.parse(body)
  var results = []

  for (var el of root.querySelectorAll('.section')) {
    if (el.text === 'Specs') {
      for (var li of el.parentNode.querySelectorAll('li')) {
        var name = li.structuredText.replace('\n', ' ')
        var link = li.querySelector('a').getAttribute('href')
        results.push({name:name, link:link})
      }
    }
  }
  return results
}
