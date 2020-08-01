var {extractSpecsFromBody} = require('./specExtraction')
var {fetchBodyWithCache} = require('./httpCache')
var {fetchPhoneList} = require('./prices')
var {findAllSpecs} = require('./spec-finder')

try {
  fetchPhoneList()
  .then(list => {
    findAllSpecs(list)
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
