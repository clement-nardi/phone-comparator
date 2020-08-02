var {extractSpecsFromBody} = require('./specExtraction')
var {fetchBodyWithCache} = require('./httpCache')
var {fetchPhoneList} = require('./prices')
var {findAllSpecs} = require('./specFinder')
var fs = require('fs').promises
var moment = require('moment')

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
      var dataFilename = './allSpecs.' + moment().format('YYYY-MM-DD-HH-mm-ss-SSS') + '.json'
      var data = JSON.stringify(phonesWithSearchResults, null, 2)
      Promise.all([
        fs.writeFile(dataFilename, data),
        fs.writeFile('./allSpecs.json', data)
      ]).then(() => {
        console.log('Done!')
      })
    })
  })
})
