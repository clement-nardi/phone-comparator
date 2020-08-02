var {extractSpecsFromBody} = require('./specExtraction')
var {fetchBodyWithCache} = require('./httpCache')
var {fetchPhoneList} = require('./prices')
var {findAllSpecs} = require('./specFinder')
var fs = require('fs').promises
var moment = require('moment')

try {
  fetchPhoneList()
  .then(list => {
    findAllSpecs(list)
    .then( phonesWithSearchResults => {
      //console.log(phonesWithSearchResults)
      var promises = []
      for (const phone of phonesWithSearchResults) {
        if (phone.searchResults.length > 0 && phone.searchResults[0].score > 0) {
          promises.push(
            fetchBodyWithCache('https://www.gsmarena.com/' + phone.searchResults[0].link)
              .then(body => {
                //console.log(phone.name)
                try {
                  phone['specs'] = extractSpecsFromBody(body)
                } catch (err) {
                  console.log('error extracting specs for ' + phone.name)
                  console.log(err)
                }
              }))
        }
      }
      Promise.all(promises).then(values => {
        fs.writeFile('./allSpecs.' + moment().format('YYYY-MM-DD-HH-mm-ss-SSS') + '.json', JSON.stringify(phonesWithSearchResults, null, 2))
      })
    })
  })

for (var uri of ['https://www.gsmarena.com/huawei_p40_pro+-10118.php',
'https://www.gsmarena.com/oppo_reno_10x_zoom-9654.php',
'https://www.gsmarena.com/oppo_find_x2_pro-9529.php']) {
  fetchBodyWithCache(uri)
  .then(body => {
    console.log('body length =' + body.length)
    var specs = extractSpecsFromBody(body)
    console.log('specs length = ' + JSON.stringify(specs).length)
  })
  .catch(err => console.error(err))
}

} catch (err) {
console.error('uncaught error...')
console.error(err)
}

console.log('the end')
