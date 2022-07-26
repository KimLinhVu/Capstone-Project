const getSimilarityMethod = async (newUserId) => {
  const id = await newUserId.toString()
  const val = parseInt(id.slice(18, 25), 16)
  const littleEndian = ((val & 0xFF) << 8) |
  ((val >> 8) & 0xFF)
  const similarityMethod = parseInt(String(littleEndian).slice(0, 2), 10) % 2
  return similarityMethod
}

exports.getSimilarityMethod = getSimilarityMethod
