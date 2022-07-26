export default class Similarity {
  normalizeData = (x, min, max, scale) => {
    /* normalizes data from 0 - scale */
    const result = ((x - min) / (max - min)) * scale
    return result
  }

  convertObjectToVector = (trackObject) => {
    let resultArray = []
    Object.keys(trackObject).forEach(key => {
      resultArray.push(trackObject[key])
    })
    return resultArray
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
    let differenceSum = 0
    let scaleSum = 0
    /* set up scale values 
    0 - acousticness
    1 - danceability
    2 - energy
    3 - instrumentalness
    4 - key
    5 - liveness
    6 - loudness
    7 - mode
    8 - speechiness
    9 - time_signature
    10 - valence
    */
    let maxValue = 0
    const scaleValues = [1.5, 1.8, 2, 1.5, .5, .3, .5, .5, 1.5, .5, 2]
    for (let i = 0; i < a.length; i++) {
      let difference = Math.abs(a[i] - b[i])
      a[i] >= b[i] ? maxValue += scaleValues[i] * a[i] : maxValue += scaleValues[i] * b[i] 

      /* scale difference based on how important each value is */
      difference *= scaleValues[i]
      differenceSum += difference
    }
    /* scale differenceSum to between 0-100 */
    return this.normalizeData(differenceSum, 0, maxValue, 100)
  }
}
