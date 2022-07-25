const Similarity = require('./similarity')

test('Test 0: propertly returns correct similarity method', () => {
  expect(Similarity.getSimilarityMethod('62da14f88d6e09b9d06dace3')).toBe(0)
})

test('Test 1: propertly returns correct similarity method', () => {
  expect(Similarity.getSimilarityMethod('62dd9b3ea1f736b714589cd8')).toBe(1)
})

test('Test 2: propertly returns correct similarity method', () => {
  expect(Similarity.getSimilarityMethod('62ded3de427cddcfaf0578a4')).toBe(0)
})

test('Test 3: propertly returns correct similarity method', () => {
  expect(Similarity.getSimilarityMethod('62ded459427cddcfaf0578f7')).toBe(1)
})

test('Test 4: propertly returns correct similarity method', () => {
  expect(Similarity.getSimilarityMethod('62dee472fd22233bb057fcbb')).toBe(0)
})