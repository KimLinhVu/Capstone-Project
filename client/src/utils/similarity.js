class Similarity {
  scaleValueObject = {
    acousticness: 1.5,
    danceability: 1.8,
    energy: 2,
    instrumentalness: 1.5,
    key: 0.5,
    liveness: 0.3,
    loudness: 0.5,
    mode: 0.5,
    speechiness: 1.5,
    time_signature: 0.5,
    valence: 2
  }

  normalizeData = (x, min, max, scale) => {
    /* normalizes data from 0 - scale */
    const result = ((x - min) / (max - min)) * scale
    return result
  }

  convertObjectToVector = (trackObject) => {
    return Object.values(trackObject)
  }

  calculateCosineSimilarity = (a, b) => {
    a = this.convertObjectToVector(a)
    b = this.convertObjectToVector(b)
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return 100
    }
    let dotproduct = 0
    let mA = 0
    let mB = 0
    for (let i = 0; i < a.length; i++) {
      dotproduct += (a[i] * b[i])
      mA += (a[i] * a[i])
      mB += (b[i] * b[i])
    }
    mA = Math.sqrt(mA)
    mB = Math.sqrt(mB)
    if ((mA * mB) === 0) {
      return 0
    }
    const similarity = Math.acos((dotproduct) / ((mA) * (mB)))
    const normalized = this.normalizeData(similarity, 0, Math.acos(0), 100)
    return 100 - normalized
  }

  /* look into multi-vari option */
  calculateEuclideanDistance = (a, b) => {
    let vectorSum = 0
    for (let i = 0; i < a.length; i++) {
      vectorSum += Math.pow(a[i] - b[i], 2)
    }
    const distance = Math.sqrt(vectorSum)
    return distance
  }

  calculateManhattanDistance = (a, b) => {
    let result = 0
    for (let i = 0; i < a.length; i++) {
      result += Math.abs(a[i] - b[i])
    }
    return result
  }

  calculateOwnSimilarity = (a, b) => {
    /* calculates similarity based on difference between values
    in same position
    range from 0 - 100; closer to 0 means more similar */
    a = this.convertObjectToVector(a)
    b = this.convertObjectToVector(b)
    let differenceSum = 0
    let maxValue = 0
    const scaleValueArray = this.convertObjectToVector(this.scaleValueObject)
    for (let i = 0; i < a.length; i++) {
      let difference = Math.abs(a[i] - b[i])
      a[i] >= b[i] ? maxValue += scaleValueArray[i] * a[i] : maxValue += scaleValueArray[i] * b[i]

      /* scale difference based on how important each value is */
      difference *= scaleValueArray[i]
      differenceSum += difference
    }
    /* scale differenceSum to between 0-100 */
    return 100 - this.normalizeData(differenceSum, 0, maxValue, 100)
  }
}

module.exports = Similarity
