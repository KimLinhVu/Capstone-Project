const PlaylistSimilarity = require('../models/PlaylistSimilarity')
require('dotenv').config()
const TrackFactor = require('../models/TrackFactors')

class Similarity {
  static getTrackFactors = async () => {
    const trackFactor = await TrackFactor.findOne()
    const trackObject = trackFactor.toObject()
    delete trackObject._id
    return trackObject
  }

  static getSimilarityMethod = async (newUserId) => {
    const id = await newUserId.toString()
    const val = parseInt(id.slice(18, 25), 16)
    const littleEndian = ((val & 0xFF) << 8) |
    ((val >> 8) & 0xFF)
    const similarityMethod = parseInt(String(littleEndian).slice(0, 2), 10) % 2
    return similarityMethod
  }

  static getSimilarityScore = (similarityMethod, playlistObject) => {
    return similarityMethod === 0 ? playlistObject.cosineSimilarityScore : playlistObject.ownSimilarityScore
  }

  static updateSimilarityScores = async () => {
    const allPlaylists = await PlaylistSimilarity.find()
    const trackFactors = await Similarity.getTrackFactors()
    const promises = allPlaylists.map(async (item) => {
      const { firstPlaylistId, firstPlaylistVector, secondPlaylistId, secondPlaylistVector } = item

      /* recalculate similarity score */
      const ownSimilarityScore = await Similarity.calculateOwnSimilarity(firstPlaylistVector, secondPlaylistVector, trackFactors)

      /* update entry with new similarity score */
      await PlaylistSimilarity.findOneAndUpdate({ firstPlaylistId, secondPlaylistId }, { ownSimilarityScore })
    })
    await Promise.all(promises)
  }

  static normalizeData = (x, min, max, scale) => {
    /* normalizes data from 0 - scale */
    const result = ((x - min) / (max - min)) * scale
    return result
  }

  static convertObjectToVector = (trackObject) => {
    return Object.values(trackObject)
  }

  static calculateCosineSimilarity = (a, b) => {
    a = Similarity.convertObjectToVector(a)
    b = Similarity.convertObjectToVector(b)
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
    const normalized = Similarity.normalizeData(similarity, 0, Math.acos(0), 100)
    return 100 - normalized
  }

  static calculateOwnSimilarity = async (a, b, trackFactors) => {
    /* calculates similarity based on difference between values
    in same position
    range from 0 - 100; closer to 0 means more similar */
    a = Similarity.convertObjectToVector(a)
    b = Similarity.convertObjectToVector(b)
    let differenceSum = 0
    let maxValue = 0
    const scaleValueArray = Similarity.convertObjectToVector(trackFactors)
    for (let i = 0; i < a.length; i++) {
      let difference = Math.abs(a[i] - b[i])
      a[i] >= b[i] ? maxValue += scaleValueArray[i] * a[i] : maxValue += scaleValueArray[i] * b[i]

      /* scale difference based on how important each value is */
      difference *= scaleValueArray[i]
      differenceSum += difference
    }
    /* scale differenceSum to between 0-100 */
    return 100 - Similarity.normalizeData(differenceSum, 0, maxValue, 100)
  }
}

module.exports = Similarity
