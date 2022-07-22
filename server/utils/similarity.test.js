const Similarity = require('./similarity')

test('propertly adds two numbers', () => {
  expect(Similarity.getSimilarityMethod('62da14f88d6e09b9d06dace3')).toBe(0)
})
