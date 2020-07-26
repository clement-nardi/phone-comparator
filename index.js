var request = require('request');
var cachedRequest = require('cached-request')(request);
var HTMLParser = require('node-html-parser');

cachedRequest.setCacheDirectory('./httpCache');

cachedRequest({uri: 'https://www.gsmarena.com/huawei_p40_pro+-10118.php',
               ttl: 1000*60*60*24*365*1000}, function (error, response, body) {
  if (error) {
    console.err(error);
  }
  if (response.headers['x-from-cache'] === 1) {
    console.log('from cache!');
  }

  var root = HTMLParser.parse(body);

  for (var el of root.querySelectorAll('.nfo')) {
    console.log(el.getAttribute('data-spec') + ':\t ' + el.text)

  }

});
