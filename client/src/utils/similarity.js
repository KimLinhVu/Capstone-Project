import axios from 'axios'
import { getTracksAudioFeatures, getPlaylistDetail } from './spotify'
import Tracks from 'utils/tracks'

export default class Similarity {
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

  createTrackVector = async (playlistId, setPlaylist) => {
    const track = new Tracks()
    const { data } = await getPlaylistDetail(playlistId)
    if (setPlaylist) {
      setPlaylist(data)
    }

    /* create string of track Ids to use in Spotify API */
    const trackIdArray = []
    const tracks = await track.getAllPlaylistTracks(data.id)
    tracks.forEach(item => {
      trackIdArray.push(item.track.id)
    })

    /* receive track audio features for each track and store in an array */
    let trackArrayLength = trackIdArray.length
    const tempTrackVector = {
      acousticness: 0,
      danceability: 0,
      energy: 0,
      instrumentalness: 0,
      key: 0,
      liveness: 0,
      loudness: 0,
      mode: 0,
      speechiness: 0,
      time_signature: 0,
      valence: 0
    }
    while (trackIdArray.length > 0) {
      const trackIdString = trackIdArray.splice(0, 100).join(',')
      const { data } = await getTracksAudioFeatures(trackIdString)
      // eslint-disable-next-line no-loop-func
      data.audio_features.forEach(item => {
        if (item !== null) {
          this.createTrackObject(tempTrackVector, item)
        } else {
          trackArrayLength -= 1
        }
      })
    }

    /* take average of all track vector quantities */
    Object.keys(tempTrackVector).forEach(key => {
      tempTrackVector[key] /= trackArrayLength
    })
    return tempTrackVector
  }

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

  getSimilarityScore = (firstPlaylistId, secondPlaylistId, similarityMethod) => {
    return axios.get('/playlist/get-similarity-score', {
      headers: {
        'x-access-token': localStorage.getItem('token'),
        'first-playlist-id': firstPlaylistId,
        'second-playlist-id': secondPlaylistId,
        'similarity-method': similarityMethod
      }
    })
  }
}
