var {fetchBodyWithCache} = require('./httpCache')
var HTMLParser = require('node-html-parser')

exports.fetchCameraReviews = () => {
  return fetchBodyWithCache('https://www.dxomark.com/category/smartphone-reviews/')
  .then(body => {
    return extractCameraReviewsFromBody(body)
  })
}

function extractCameraReviewsFromBody(body) {
  var root = HTMLParser.parse(body)
  var reviews = []
  var names = new Set()
  for (let el of root.querySelectorAll('.listElement')) {
    let name = el.querySelector('h3 a')
    if (name && !names.has(name.text)) {
      names.add(name.text)
      let review = {name:name.text}
      let mobile = el.querySelector('.mobile .deviceScore').structuredText
      let selfie = el.querySelector('.selfie .deviceScore').structuredText
      let audio = el.querySelector('.audio .deviceScore').structuredText
      if (mobile) {review.mobile = parseFloat(mobile)}
      if (selfie) {review.selfie = parseFloat(selfie)}
      if (audio) {review.audio = parseFloat(audio)}

      reviews.push(review)
    }
  }

  return reviews
}

exports.insertReviewsInPhones = (phones, reviews) => {
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
