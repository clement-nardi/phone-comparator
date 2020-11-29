const {extractSubScrores} = require('./cameraReviews');
const fs = require('fs')

test('subScore extraction from html', () => {

  var body = ''
  var subScores = {}

  body = fs.readFileSync('./httpCache/https!www.dxomark.com!apple-iphone-11-pro-max-audio-review').toString()
  subScores = extractSubScrores(body)
  expect(Object.keys(subScores).length).toEqual(2)

  body = fs.readFileSync('./httpCache/https!www.dxomark.com!oppo-find-x2-pro-display-review-slightly-off-the-pace').toString()
  subScores = extractSubScrores(body)
  expect(Object.keys(subScores).length).toEqual(1)

})
