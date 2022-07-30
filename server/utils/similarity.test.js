const Similarity = require('./similarity')
const similar = new Similarity()

test('returns 0 when 3-byte inc. counter in mongodb object id is an even number', async () => {
  const res = await similar.getSimilarityMethod('62da14f88d6e09b9d06dace3')
  expect(res).toBe(0)
})

test('returns 1 when 3-byte inc. counter in mongodb object id is an odd number', async () => {
  const res = await similar.getSimilarityMethod('62dd9b3ea1f736b714589cd8')
  expect(res).toBe(1)
})

test('returns 0 when 3-byte inc. counter in mongodb object id is an even number', async () => {
  const res = await similar.getSimilarityMethod('62ded3de427cddcfaf0578a4')
  expect(res).toBe(0)
})

test('returns 1 when 3-byte inc. counter in mongodb object id is an odd number', async () => {
  const res = await similar.getSimilarityMethod('62ded459427cddcfaf0578f7')
  expect(res).toBe(1)
})

test('returns 0 when 3-byte inc. counter in mongodb object id is an even number', async () => {
  const res = await similar.getSimilarityMethod('62dee472fd22233bb057fcbb')
  expect(res).toBe(0)
})
