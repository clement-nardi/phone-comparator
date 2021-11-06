import fetch from 'node-fetch'
import AbortController from 'abort-controller'
import filenamify from 'filenamify'
import fs from 'fs/promises'
import oldFs from 'fs'
import {Mutex} from 'async-mutex'
import HttpsProxyAgent from 'https-proxy-agent'
import {Semaphore} from 'await-semaphore'

const cacheDir = './httpCache/'
const proxyStats = './proxyStats/'
const nbParallelProxies = 20

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

async function fetchBody(uri) {
  if (typeof fetchBody.proxies == 'undefined') {
    let proxies = loadProxies()
    fetchBody.proxies = proxies
    console.log(proxies.slice(0,20))
    fetchBody.semaphore = new Semaphore(proxies.length / 2);
    console.log(fetchBody.semaphore)
  }
  console.log('fetchBody')

  let answer = null
  let nbTries = 0
  while (! answer) {
    nbTries += 1
    let release = await fetchBody.semaphore.acquire()
    console.log(`try ${nbTries} for ${uri}`)
    const proxy = fetchBody.proxies[0]
    proxy.nbFetch += 1
    sortProxies(fetchBody.proxies)
  
    //console.log(fetchBody.proxies.map(p => p.nbFetch).join())
    //console.log('chosen proxy: ')
    console.log(proxy.ipPort)
  
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000);

    try {
      
      const start = new Date()

      let res = await fetch(uri, { agent: new HttpsProxyAgent('http://' + proxy.ipPort), signal: controller.signal})
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
        proxy.stats.lastResponseIsSuccess = true
        answer = res.text()
      } else {
        throw new Error(res)
      }
    } catch(err) {
      proxy.stats.nbErrors += 1
      proxy.stats.lastResponseIsSuccess = false
      //console.log('catch')
      //console.error(err)
    } finally {
      clearTimeout(timeout);
    }
    
    fs.writeFile(proxyStats + filenamify(proxy.ipPort), JSON.stringify(proxy.stats))
    proxy.nbFetch -= 1
    sortProxies(fetchBody.proxies)
    release()
  }

  return answer

}

function loadProxies() {
  var proxies = []
  for (var ipPort of oldFs.readFileSync('./http_proxies.txt', {encoding: 'utf8'}).replace('\r','').split('\n')) {
    if (! ipPort.match(/\d+\.\d+\.\d+\.\d+.*/)) {
      continue
    }
    var statFile = proxyStats + filenamify(ipPort)
    if (!oldFs.existsSync(proxyStats)) {
      fs.mkdir(proxyStats)
    }
    if (!oldFs.existsSync(cacheDir)) {
      fs.mkdir(cacheDir)
    }
    //console.log(statFile)
    var data = {
      ipPort: ipPort,
      stats: {
        nbSuccess: 0,
        nbErrors: 0,
        lastResponseTime: 1,
        lastResponseIsSuccess: true
      },
      mutex: new Mutex(),
      nbFetch: 0
    }
    if (oldFs.existsSync(statFile)) {
      let existingStats = {}
      try {
        existingStats = JSON.parse(oldFs.readFileSync(statFile))
      } catch(e) {
      }
      data.stats = {...data.stats, ...existingStats}
    }
    proxies.push(data)
  }
  sortProxies(proxies)
  return proxies
}

function sortProxies(proxies) {
  proxies.sort((a,b) => {
    if (a.nbFetch != b.nbFetch) {
      return a.nbFetch - b.nbFetch
    }
    if (a.lastResponseIsSuccess != a.lastResponseIsSuccess) {
      return a.lastResponseIsSuccess? 1 : -1
    }
    return proxyScore(b) - proxyScore(a)
  })
}

function proxyScore(proxy) {
  return (proxy.stats.nbSuccess*10000/proxy.stats.lastResponseTime) - proxy.stats.nbErrors
}

function fetchBodyWithCache(uri, forceDownload) {
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

export {fetchBodyWithCache}