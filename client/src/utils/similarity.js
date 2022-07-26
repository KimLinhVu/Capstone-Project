class Similarity {
  normalizeData = (x, min, max, scale) => {
    /* normalizes data from 0 - scale */
    const result = ((x - min) / (max - min)) * scale
    return result
  }

  convertObjectToVector = (trackObject) => {
    return Object.values(trackObject)
  }

  createTrackObject = (tempTrackVector, item) => {
    Object.keys(tempTrackVector).forEach(key => {
      let itemValue = item[key]
      /* scale certain values down to 0-1 */
      if (key === 'key') {
        const scaledValue = this.normalizeData(item[key], 0, 11, 1)
        itemValue = scaledValue
      } else if (key === 'loudness') {
        const scaledValue = this.normalizeData(item[key], -60, 0, 1)
        itemValue = scaledValue
      } else if (key === 'time_signature') {
        const scaledValue = this.normalizeData(item[key], 3, 7, 1)
        itemValue = scaledValue
      }
      tempTrackVector[key] += itemValue
    })
  }

  calculateCosineSimilarity = (a, b) => {
    a = this.convertObjectToVector(a)
    b = this.convertObjectToVector(b)
    if (JSON.stringify(a) === JSON.stringify(b)) {
      return 0
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
    const similarity = Math.acos((dotproduct) / ((mA) * (mB)))
    const normalized = this.normalizeData(similarity, 0, Math.acos(0), 100)
    return normalized
  }

  /* look into multi-vari option */
  calculateEuclideanDistance = (a, b) => {
    let vectorSum = 0
    for (let i = 0; i < a.length; i++) {
      vectorSum += Math.pow(a[i] - b[i], 2)
    }
    let distance = Math.sqrt(vectorSum)
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
    /* set up scale values 
    acousticness
    danceability
    energy
    instrumentalness
    key
    liveness
    loudness
    mode
    speechiness
    time_signature
    valence
    */
    let maxValue = 0
    const scaleValueObject = {
      acousticness: 1.5,
      danceability: 1.8,
      energy: 2,
      instrumentalness: 1.5,
      key: .5,
      liveness: .3,
      loudness: .5,
      mode: .5,
      speechiness: 1.5,
      time_signature: .5,
      valence: 2
    }
    const scaleValueArray = this.convertObjectToVector(scaleValueObject)
    for (let i = 0; i < a.length; i++) {
      let difference = Math.abs(a[i] - b[i])
      a[i] >= b[i] ? maxValue += scaleValueArray[i] * a[i] : maxValue += scaleValueArray[i] * b[i] 

      /* scale difference based on how important each value is */
      difference *= scaleValueArray[i]
      differenceSum += difference
    }
    /* scale differenceSum to between 0-100 */
    return this.normalizeData(differenceSum, 0, maxValue, 100)
  }
}

module.exports = Similarity
