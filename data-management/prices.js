import {fetchBodyWithCache} from './httpCache.js'
import HTMLParser from 'node-html-parser'

function fetchPhoneList() {
  return fetchBodyWithCache('https://www.i-comparateur.com/comparer-prix-x40c0062b0.htm')
  .then(body => {
    return extractPhoneListFromBody(body)
  })
}

function extractPhoneListFromBody(body) {
  var root = HTMLParser.parse(body)
  var phoneList = []

  var table = root.querySelector('.TList')
  for (var child of table.childNodes) {
    if (child.tagName === 'TR') {
      var la = child.querySelector('.La')
      var laText = la.text
      var prText = child.querySelector('.Pr').text
      var match = laText.match(/(.*) \((\d+) ref\.\)/)
      var name = match[1]
      var nbOffers = parseInt(match[2])
      var price = parseFloat(prText.substring(0,prText.length - 2).replace(/\s/g, '').replace(/,/g, '.'))
      var link = la.querySelector('a').getAttribute('href')
      phoneList.push({name: name, price: price, nbOffers: nbOffers, link: link})
    }
  }
  return phoneList
}

export {fetchPhoneList}