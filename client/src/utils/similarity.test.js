const Similarity = require('./similarity.js')

test('Test 0: properly calculates cosine similarity', () => {
  const a = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const b = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const similar = new Similarity()
  expect(similar.calculateCosineSimilarity(a, b)).toBe(0)
})

test('Test 1: properly calculates cosine similarity', () => {
  const a = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const b = [0.242, 0.730, 0.432, 0.017, 0.490, 0.193, 0.844, 0.6, 0.105, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateCosineSimilarity(a, b)).toBeCloseTo(9.2762, 4)
})

test('Test 2: properly calculates cosine similarity', () => {
  const a = [0.257, 0.605, 0.621, 0.0004, 0.538, 0.195, 0.896, 0.826, 0.059, 0.250, 0.430]
  const b = [0.368, 0.618, 0.478, 0.005, 0.561, 0.177, 0.859, 0.708, 0.081, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateCosineSimilarity(a, b)).toBeCloseTo(7.8237, 4)
})

test('Test 3: properly calculates cosine similarity', () => {
  const a = [0.552, 0.461, 0.366, 0.071, 0.468, 0.166, 0.824, 0.7, 0.048, 0.15, 0.383]
  const b = [0.324, 0.235, 0.742, 0.942, 0.435, 0.436, 0.351, 0.3, 0.845, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateCosineSimilarity(a, b)).toBeCloseTo(57.6561, 4)
})

test('Test 0: properly calculates own similarity', () => {
  const a = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const b = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const similar = new Similarity()
  expect(similar.calculateOwnSimilarity(a, b)).toBe(0)
})

test('Test 1: properly calculates own similarity', () => {
  const a = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const b = [0.242, 0.730, 0.432, 0.017, 0.490, 0.193, 0.844, 0.6, 0.105, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateOwnSimilarity(a, b)).toBeCloseTo(17.3879, 4)
})

test('Test 2: properly calculates own similarity', () => {
  const a = [0.257, 0.605, 0.621, 0.0004, 0.538, 0.195, 0.896, 0.826, 0.059, 0.250, 0.430]
  const b = [0.368, 0.618, 0.478, 0.005, 0.561, 0.177, 0.859, 0.708, 0.081, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateOwnSimilarity(a, b)).toBeCloseTo(12.2634, 4)
})

test('Test 3: properly calculates own similarity', () => {
  const a = [0.552, 0.461, 0.366, 0.071, 0.468, 0.166, 0.824, 0.7, 0.048, 0.15, 0.383]
  const b = [0.324, 0.235, 0.742, 0.942, 0.435, 0.436, 0.351, 0.3, 0.845, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateOwnSimilarity(a, b)).toBeCloseTo(58.8403, 4)
})

test('test calculate euclidean distance', () => {
  const a = [0.333, 0.675, 0.616, 0.001]
  const b = [0.242, 0.730, 0.432, 0.017]
  const similar = new Similarity()
  expect(similar.calculateEuclideanDistance(a, b)).toBeCloseTo(.2131, 4)
})