import {fetchBodyWithCache} from './httpCache.js'
import HTMLParser from 'node-html-parser'

function fetchCameraReviews() {
  return fetchBodyWithCache('https://www.dxomark.com/smartphones/')
  .then(body => {
    return extractCameraReviewsFromBody(body)
  })
}

async function extractCameraReviewsFromBody(body) {
  var reviews = []

  const smartphones = JSON.parse(body.match(/var smartphonesAsJson = (.+);/)[1])
  console.log(smartphones)

  reviews = await Promise.all(
    smartphones.map(s => buildReview(s))
  )

  return reviews
}

async function buildReview(smartphone) {
  let review = {
    name : smartphone.name,
  }

  for (let section of ["mobile", "selfie", "audio", "display"]) {
    if (smartphone[section] && smartphone[section].url) {
      //console.log(smartphone[section].url)
      let sectionBody = await fetchBodyWithCache(smartphone[section].url)
      review[section] = extractSubScrores(sectionBody)
      review[section].link = smartphone[section].url

      if (Object.keys(review[section]).length === 0) {
        console.log('Unable to extract subscores from ' + smartphone[section].url)
      }
    }
    if (smartphone[section] && smartphone[section].subscores) {
      if (!review[section]) {
        review[section] = {}
      }
      for (let subScoreKey in smartphone[section].subscores) {
        let subScore = smartphone[section].subscores[subScoreKey]
        review[section][subScoreKey] = {overallScore: subScore}
      }
    }
    const sectionScore = smartphone[section + 'Score']
    if (sectionScore) {
      if (!review[section]) {
        review[section] = {}
      }
      review[section].overallScore = sectionScore
    }
  }
  return review
}


function extractSubScrores(body) {
  let matches = [...body.matchAll(/scoreBarsChart\('', \[([^\]]*)\], \[([^\]]*)\]\.reverse\(\), '([^']*)', '([^']*)', 'en'\);/g)]

  let subScores = {}

  for (let match of matches) {
    let name = match[4]
    if (! name) {
      name = match[3]
    }
    subScores[name] = {}
    let scoreNames = match[1].replace(/[ ']/g, '').split(',')
    let scores = match[2].replace(/[ ']/g, '').split(',')
    for (let i in scoreNames) {
      subScores[name][scoreNames[i].toLowerCase()] = parseFloat(scores[i])
    }

    /* main score */
    let scoreIndex = body.lastIndexOf('class="value">', match.index) + 14
    let overallScore = parseFloat(body.substring(scoreIndex))
    subScores[name].overallScore = overallScore
  }

  if (Object.keys(subScores).length == 0) {
    var root = HTMLParser.parse(body)
    for (var el of root.querySelectorAll('.bars_chart_scores')) {
      var type = el.getAttribute('data-type')
      var overallScore = el.getAttribute('data-score').replace(/ /g, '')
      var scores = el.getAttribute('data-array').replace(/ /g, '').split(',')

      var categories = []
      if (type == 'playback' || type == 'recording') {
        categories = ['timbre', 'dynamics', 'spatial', 'volume', 'artifacts', 'background']
      } else if (type == 'photo') {
        categories = ['exposure', 'color', 'focus', 'texture', 'noise', 'artifacts', 'flash', 'bokeh']
      } else if (type == 'video') {
        categories = ['exposure', 'color', 'focus', 'texture', 'noise', 'artifacts', 'stabilization']
      } else {
        console.log('WARNING: unknown scores category: ' + type)
      }
      subScores[type] = {overallScore: parseFloat(overallScore)}

      for (let i in scores) {
        subScores[type][categories[i]] = parseFloat(scores[i])
      }
    }
  }

  if (Object.keys(subScores).length == 0) {
    var root = HTMLParser.parse(body)
    for (var el of root.querySelectorAll('.subscoreHeading')) {
      var classes = el.classNames.split(" ").filter(c => c != "hide-best")
      var scoreEl = el.querySelector('.currentDeviceSubScore')
      if (scoreEl) {
        const score = scoreEl.text 
        if (!subScores[classes[2]]) {
          subScores[classes[2]] = {}
        }
        subScores[classes[2]][classes[1]] = parseFloat(score)
      }
    }
  }

  //console.log(subScores)

  return subScores
}

function insertReviewsInPhones(phones, reviews) {
  let phonesByName = {}
  for (let phone of phones) {
    let name = phone.name
    let match = name.match(/Samsung S.* - (.*)/)
    if (match) {
      name = 'Samsung ' + match[1]
    }

    phonesByName[stripStr(name)] = phone

    match = name.match(/(.*) (5G|4G)/)
    if (match) {
      name = match[1]
      if (!phonesByName[stripStr(name)]) {
        phonesByName[stripStr(name)] = phone
      }
    }

    match = name.match(/(.*) - (.*)/)
    if (match) {
      name = match[1]
      if (!phonesByName[stripStr(name)]) {
        phonesByName[stripStr(name)] = phone
      }
    }

    match = name.match(/(.*) \(.*\)/)
    if (match) {
      name = match[1]
      if (!phonesByName[stripStr(name)]) {
        phonesByName[stripStr(name)] = phone
      }
    }

  }
  let count = 0
  for (let review of reviews) {
    let name = review.name
    if (!name) {
      console.warn('no name for review: ' + review)
      continue
    }
    if (!phonesByName[stripStr(name)]) {
      let match = name.match(/(.*) (5G|4G|ThinQ)/)
      if (match) {
        name = match[1]
      } else {
        if (name.includes('Google')) {
          name = name.replace('Google', 'Huawei')
        }
      }
    }
    if (!phonesByName[stripStr(name)]) {
      count++
      console.warn('Camera review with no match in prices: ' + review.name)
    } else {
      phonesByName[stripStr(name)].cameraReview = review
    }
  }
  console.log(count)
}

function stripStr(str) {
  return str.replace(/[ \-()]/g, '').toLowerCase()
}

export {fetchCameraReviews, extractSubScrores, insertReviewsInPhones}