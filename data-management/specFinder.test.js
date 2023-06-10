import {searchSpecs} from './specFinder'

it('search results extraction', () => {
  return testSearch('Crosscall Spider X1', 0)
});

function testSearch(name, expectedNumberOfResults) {
  expect.assertions(1)
  return searchSpecs(name)
  .then(results => {
    console.log(results)
    expect(results.length).toBe(expectedNumberOfResults)
  })
}
