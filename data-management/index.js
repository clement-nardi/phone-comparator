import {extractSpecsFromBody} from './specExtraction.js'
import {fetchBodyWithCache} from './httpCache.js'
import {fetchPhoneList} from './prices.js'
import {findAllSpecs} from './specFinder.js'
import {fetchCameraReviews, insertReviewsInPhones} from './cameraReviews.js'
import fs from 'fs/promises'
import moment from 'moment'

for (let type of ['tablets']){ //, 'phones']) {
  fetchPhoneList(type)
    .then(list => {
      findAllSpecs(list)
        .then( phonesWithSearchResults => {
          //console.log(phonesWithSearchResults)
          var promises = []
          for (const phone of phonesWithSearchResults) {
            if (phone.searchResults.length == 1 && phone.searchResults[0].score == 0) {
              console.warn('Only 1 search result, but not exact match:')
              console.warn(phone.name)
              console.warn(phone.searchResults[0].name)
            }
            if (phone.searchResults.length > 0 && (phone.searchResults[0].score > 0 || phone.searchResults.length == 1)) {
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
          Promise.all(promises).then(() => {
            fetchCameraReviews()
              .then(reviews => {
                console.log('done reviews')
                console.log(reviews.length)
                insertReviewsInPhones(phonesWithSearchResults, reviews)
                var namePrefix = "./" + type + "-specs"
                var dataFilename = namePrefix + '-' + moment().format('YYYY-MM-DD-HH-mm-ss-SSS') + '.json'
                var data = JSON.stringify(phonesWithSearchResults, null, 2)
                Promise.all([
                  fs.writeFile(dataFilename, data),
                  fs.writeFile(namePrefix + '.json', data)
                ]).then(() => {
                  console.log('Done!')
                })
              })
          })
        })
    })
}