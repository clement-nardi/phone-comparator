const fetch = require('node-fetch');
const filenamify = require('filenamify');
const fs = require('fs').promises
const oldFs = require('fs')
var Mutex = require('async-mutex').Mutex;
var HttpsProxyAgent = require('https-proxy-agent');

const cacheDir = './httpCache/'
const proxyStats = './proxyStats/'
const nbParallelProxies = 20

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function fetchBody(uri) {
  if (typeof fetchBody.proxies == 'undefined') {
    proxies = loadProxies()
    fetchBody.proxies = proxies
    console.log(proxies.slice(0,20))
  }

  const proxy = fetchBody.proxies[0]
  proxy.nbFetch += 1
  sortProxies(fetchBody.proxies)

  return proxy.mutex.acquire()
  .then(release => {
    console.log('fetching ' + uri)
    const start = new Date()
    return fetch(uri, { agent: new HttpsProxyAgent('http://' + proxy.ipPort),
                        timeout: 2000 })
    .then(res => {
      proxy.stats.lastResponseTime = new Date() - start
      /* if (res.status == 429) {
        var retryAfter = parseInt(res.headers.get('retry-after'))
        setTimeout(release, retryAfter * 1000)
        console.warn('429 Too Many Requests at ' + uri)
        console.warn('retrying after ' + retryAfter + ' seconds')
        return fetchBody(uri)
      } else */
      if (res.status == 200) {
        proxy.stats.nbSuccess += 1
        return res.text()
      } else {
        throw new Error(res)
      }
    })
    .catch(err => {
      proxy.stats.nbErrors += 1
      console.error(err)
      return fetchBody(uri)
    })
    .finally(() => {
      fs.writeFile(proxyStats + filenamify(proxy.ipPort), JSON.stringify(proxy.stats))
      proxy.nbFetch -= 1
      sortProxies(fetchBody.proxies)
      setTimeout(release, 200)
    })
  })
}

function loadProxies() {
  var proxies = []
  for (var ipPort of oldFs.readFileSync('./http_proxies.txt', {encoding: 'utf8'}).split('\r\n')) {
    if (! ipPort.match(/\d+\.\d+\.\d+\.\d+.*/)) {
      continue
    }
    var statFile = proxyStats + filenamify(ipPort)
    //console.log(statFile)
    var data = {
      ipPort: ipPort,
      stats: {
        nbSuccess: 0,
        nbErrors: 0,
        lastResponseTime: 1
      },
      mutex: new Mutex(),
      nbFetch: 0
    }
    if (oldFs.existsSync(statFile)) {
      data.stats = JSON.parse(oldFs.readFileSync(statFile))
    }
    proxies.push(data)
  }
  sortProxies(proxies)
  return proxies
}

function sortProxies(proxies) {
  proxies.sort((a,b) => {
    return proxyScore(b) - proxyScore(a)
  })
  proxies.slice(0, nbParallelProxies).sort((a, b) => {
    return a.nbFetch - b.nbFetch
  })
}

function proxyScore(proxy) {
  return (proxy.stats.nbSuccess*10000/proxy.stats.lastResponseTime) - proxy.stats.nbErrors
}

exports.fetchBodyWithCache = (uri, forceDownload) => {
  return loadFromCache(uri)
    .catch(err => {
      return fetchBody(uri)
      .then(body => {
        return sendToCache(uri, body)
        .then(() => {return body})
      })
    })
}

function uriToFileName(uri) {
  return filenamify(uri)
}

function cacheFile(uri) {
  return cacheDir + uriToFileName(uri)
}

function sendToCache(uri, body) {
  return fs.writeFile(cacheFile(uri), body)
}

function loadFromCache(uri) {
  var filepath = cacheFile(uri)
  return new Promise((resolve, reject) => {
    fs.stat(filepath)
    .then(stat => {
      fs.readFile(filepath, {encoding: 'utf8'})
      .then(content => {
        resolve(content)
      })
      .catch(err => {
        console.warn('unable to read the cache file ' + filepath)
        reject(err)
      })
    })
    .catch(err => {reject(err)})
  })
}
