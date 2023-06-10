import {fetchBodyWithCache} from './httpCache.js'
import HTMLParser from 'node-html-parser'
import fs from 'fs'

function fetchCameraReviews() {
  return fetchBodyWithCache('https://www.dxomark.com/smartphones/')
  .then(body => {
    return extractCameraReviewsFromBody(body)
  })
}

async function extractCameraReviewsFromBody(body) {
  var reviews = []
  let beginning = "var smartphonesAsJson = "
  let smartphones_str = body.substring(
    body.indexOf(beginning) + beginning.length,
    body.indexOf('}}];') + 3
  )

  const smartphones = JSON.parse(smartphones_str)
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
  if (smartphone.name == "Google Pixel 7 Pro") {
    console.log("YEY")
  }

  let smartphone_url = "https://www.dxomark.com/smartphones/" + smartphone.brand + "/" + smartphone.model.replace(/ /g, "-")
  console.log(smartphone_url)
  let body = await fetchBodyWithCache(smartphone_url)
  var root = HTMLParser.parse(body)

  for (let section of ["mobile", "selfie", "audio", "display"]) {
    if (smartphone[section]) {
      let section_url = ""
      if (smartphone[section].url) {
        section_url = smartphone[section].url
      } else {

        // <div class="col large-9 small-12 tab-content" x-show="tab === 'display'"></div>
        
        let d = root.querySelector('div[x-show="tab === \'' + section + '\'"]')
        let a = null
        if (d) {
          a = d.querySelector('.big-buttons a')
        }
        if (!a) {
          a = root.querySelector('.big-buttons a[href*=' + section + ']')
        }
        if (!a) {
          if (section == "selfie") {
            a = root.querySelector('.big-buttons a[href*=front-camera]')
          } else if (section == "mobile") {
            let as = root.querySelectorAll('.big-buttons a[href*=camera]')
            for (let link of as) {
              if (link.getAttribute('href').includes('front-camera')) {
                continue
              }
              a = link
              break
            }
          }
        }
        if (!a) {
          let as = root.querySelectorAll('.big-buttons a')
          console.log("possible urls:")
          for (let i = 0; i < as.length; i++) {
            console.log(as[i].getAttribute('href'))
          }
          console.log("toto")
        }

        if (a) {
          section_url = a.getAttribute('href')
        } else {
          console.log("Unable to find url for " + section + " in " + smartphone_url)
          return {}
        }
       
        console.log(section_url)
      }
      //console.log(smartphone[section].url)
      let sectionBody = await fetchBodyWithCache(section_url)
      review[section] = extractSubScrores(sectionBody)
      review[section].link = smartphone[section].url

      if (Object.keys(review[section]).length === 0) {
        console.log('Unable to extract subscores from ' + smartphone[section].url)
      }

    }
  }
  if (smartphone.mobileScore && review.mobile) {
    review.mobile.overallScore = smartphone.mobileScore
  }
  if (smartphone.selfieScore && review.selfie) {
    review.selfie.overallScore = smartphone.selfieScore
  }
  if (smartphone.audioScore && review.audio) {
    review.audio.overallScore = smartphone.audioScore
  }
  if (smartphone.displayScore && review.display) {
    review.display.overallScore = smartphone.displayScore
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
    for (var el of root.querySelectorAll('.summaryBar')) {
      var title = el.querySelector('.subscoreTitle>a').getAttribute('href').substring(1).split('-')
      var score = el.querySelector('.currentScore').text
      if (!subScores[title[0]]) {
        subScores[title[0]] = {}
      }
      subScores[title[0]][title[1]] = parseFloat(score)
    }
    for (var el of root.querySelectorAll('.subscores')) {
      var title = el.querySelector('a').getAttribute('href').substring(1)
      var score = el.querySelector('span').text
      subScores[title].overallScore = parseFloat(score)
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