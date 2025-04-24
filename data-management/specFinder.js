import { fetchBodyWithCache } from './httpCache.js'
import HTMLParser from 'node-html-parser'
import crypto from 'crypto'

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
  return findSpecsRec(names, 0, [])
    .then(specs => {
      for (var spec of specs) {
        rateSpec(spec, names)
      }
      phone['searchResults'] = specs.sort((a, b) => { return b.score - a.score })
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
        return findSpecsRec(names, i + 1, best)
      } else {
        if (results.length < best.length || best.length === 0) {
          best = results
        }
        return findSpecsRec(names, i + 1, best)
      }
    })
}

function searchSpecs(name) {
  var sSearch = encodeURIComponent(name).replace(/%20/g, '+')
  return fetchBodyWithCache('https://www.gsmarena.com/res.php3?sSearch=' + sSearch)
    .then(body => {
      return analyseSearchResults(body)
    })
}

async function decryptData(t, e, n) { 
  const c = function (t) { 
    const e = atob(t), n = new ArrayBuffer(e.length), r = new Uint8Array(n); 
    for (let t = 0; t < e.length; t++)r[t] = e.charCodeAt(t); 
    return n 
  }
  let r, o, i; 
  try { 
    r = c(e), o = c(t), i = c(n) 
  } catch (t) { 
    return Promise.reject('decryptMessage: failed conversion from base64 with "' + t.toString() + '"') 
  } 
  const text = await crypto.subtle.importKey("raw", r, { name: "AES-CBC" }, !1, ["decrypt"])
  const decrypted = await crypto.subtle.decrypt({ name: "AES-CBC", iv: o }, text, i) 
  return (new TextDecoder).decode(decrypted)
}


async function analyseSearchResults(body) {

  var KEY = body.match(/const KEY  = "(.+)";/)?.[1]
  var IV = body.match(/const IV   = "(.+)";/)?.[1]
  var DATA = body.match(/const DATA = "(.+)";/)?.[1]

  if (DATA) {
    const text = await decryptData(IV, KEY, DATA)

    if (text.includes("We're sorry")) {
      return []
    } else {
      return parseSearchResults(text)
    }
  } else {
    return parseSearchResults(body)
  }
}

function parseSearchResults(content) {
  var root = HTMLParser.parse(content)
  var results = []

  for (var el of root.querySelectorAll('.section')) {
    if (el.text === 'Specs') {
      var ul = el.parentNode.querySelector('ul')
      if (el.parentNode.tagName == 'html' || !ul) {
        return results
      }

      for (var li of ul.querySelectorAll('li')) {
        var name = li.structuredText.replace('\n', ' ')
        var link = li.querySelector('a').getAttribute('href')
        results.push({ name: name, link: link })
      }
    }
  }
  return results
}


export {
  findAllSpecs,
  findSpecs,
  searchSpecs
}