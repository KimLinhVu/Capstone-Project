const axios = require('axios')
class Similarity {
  getTrackFactors = async () => {
    const { data } = await axios.get('/trackFactor')
    delete data._id
    return data
  }

  updateTrackFactors = (trackFactor) => {
    return axios.post('/trackFactor', {
      trackFactor
    })
  }

  recalculateTrackFactor = async (userTrackVector, vector) => {
    /* get values from vector objects */
    const trackVector = Object.values(userTrackVector)
    const playlistVector = Object.values(vector)

    /* get current track factors */
    const trackFactor = await this.getTrackFactors()
    const trackFactorKeys = Object.keys(trackFactor)
    const trackFactorValues = Object.values(trackFactor)

    const newTrackFactor = Object.assign({}, trackFactor)

    for (let i = 0; i < trackVector.length; i++) {
      /* get difference in value between track and og playlist */
      const difference = Math.abs(trackVector[i] - playlistVector[i])

      /* reverse and scale difference */
      /* bigger difference equates to decrease in factor */
      const scale = (1 - difference) * 2

      /* take midpoint between new factor and current factor */
      const midpoint = (scale + trackFactorValues[i]) / 2
      newTrackFactor[trackFactorKeys[i]] = midpoint.toFixed(2)
    }
    /* update track factor in db */
    await this.updateTrackFactors(newTrackFactor)

    /* resync all playlists with new track factors */
    await this.updateAllSimilarityScores()
  }

  updateAllSimilarityScores = async () => {
    return axios.post('/playlist/update-similarity-scores')
  }

  getSimilarityScore = async (similarityMethod, vector, userVector) => {
    if (similarityMethod === 0) {
      return this.calculateCosineSimilarity(vector, userVector)
    } else {
      return await this.calculateOwnSimilarity(vector, userVector)
    }
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

  calculateOwnSimilarity = async (a, b) => {
    /* calculates similarity based on difference between values
    in same position
    range from 0 - 100; closer to 0 means more similar */
    a = this.convertObjectToVector(a)
    b = this.convertObjectToVector(b)
    let differenceSum = 0
    let maxValue = 0

    const trackFactors = await this.getTrackFactors()
    const scaleValueArray = this.convertObjectToVector(trackFactors)
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
