const fetch = require('node-fetch');
const filenamify = require('filenamify');
const fs = require('fs').promises
var Mutex = require('async-mutex').Mutex;

const cacheDir = './httpCache/'
const webMutex = new Mutex();

fetchBody = (uri) => {
  return webMutex.acquire()
  .then(release => {
    return fetch(uri)
    .then(res => {
      setTimeout(release, 1000)
      return res.text()
    })
  })
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
