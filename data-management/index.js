var {downloadSpecs} = require('./specExtraction')

for (var uri of ['https://www.gsmarena.com/huawei_p40_pro+-10118.php',
'https://www.gsmarena.com/oppo_reno_10x_zoom-9654.php',
'https://www.gsmarena.com/oppo_find_x2_pro-9529.php']) {
  downloadSpecs(uri)
  .then((specs) => {
    console.log(specs)
  })
  .catch(err => {
    console.error(err)
  })
}
