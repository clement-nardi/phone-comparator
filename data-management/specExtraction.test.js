const {extractSpecsFromBody} = require('./specExtraction');
const fs = require('fs')

const testDataDir = './testData/'

test('spec extraction from html', () => {
  for (var entry of fs.readdirSync(testDataDir)) {
    if (entry.endsWith('.html')) {
      var expectedFile = entry.replace('.html', '-expected.json')
      var actualFile = entry.replace('.html', '-actual.json')
      var body = fs.readFileSync(testDataDir + entry)
      var actualSpecs = extractSpecsFromBody(body)
      fs.writeFileSync(testDataDir + actualFile, JSON.stringify(actualSpecs, null, 2))
      if (!fs.existsSync(testDataDir + expectedFile)) {
        fs.writeFileSync(testDataDir + expectedFile, JSON.stringify(actualSpecs, null, 2))
      } else {
        var expectedSpecs = JSON.parse(fs.readFileSync(testDataDir + expectedFile))
        expect(expectedSpecs).toEqual(actualSpecs)

      }
    }
  }
  expect(1+2).toBe(3)
});
