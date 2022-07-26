const Similarity = require('./similarity.js')

test('properly calculates cosine similarity', () => {
  const a = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const b = [0.242, 0.730, 0.432, 0.017, 0.490, 0.193, 0.844, 0.6, 0.105, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateCosineSimilarity(a, b)).toBeCloseTo(9.2762, 4)
})

test('properly calculates own similarity', () => {
  const a = [0.333, 0.675, 0.616, 0.001, 0.472, 0.161, 0.906, 0.6, 0.089, 0.230, 0.536]
  const b = [0.242, 0.730, 0.432, 0.017, 0.490, 0.193, 0.844, 0.6, 0.105, 0.25, 0.415]
  const similar = new Similarity()
  expect(similar.calculateOwnSimilarity(a, b)).toBeCloseTo(17.3879, 4)
})

test('test calculate euclidean distance', () => {
  const a = [0.333, 0.675, 0.616, 0.001]
  const b = [0.242, 0.730, 0.432, 0.017]
  const similar = new Similarity()
  expect(similar.calculateEuclideanDistance(a, b)).toBeCloseTo(0.2131, 4)
})
