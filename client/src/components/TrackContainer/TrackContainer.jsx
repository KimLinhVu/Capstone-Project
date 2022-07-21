import React from 'react'
import './TrackContainer.css'
import Track from 'components/Track/Track'
import ReactLoading from 'react-loading'

function TrackContainer({
  tracks,
  isLoading
}) {
  const [tracks, setTracks] = useState(null)
  const track = new Tracks()
  const similar = new Similarity()

  /* calculate similarity score for each track and sort */
  /* implement filter by similarity score option */
  useEffect(() => {
    const getAllTracks = async () => {
      /* fetches originalPlaylist track vector */
      const result = await getPlaylistTrackVector(originalPlaylistId)
      const vector = similar.convertObjectToVector(result.data)
      
      /* get all tracks in a user's playlist */
      const allTracks = await track.getAllPlaylistTracks(playlistId)

      /* gets track audio features for each track */
      const trackIdArray = allTracks.map(item => {
        return item.track.id
      })

      /* initialize tracks array */
      const tempTracks = []

      while (trackIdArray.length > 0) {
        let trackIdString = trackIdArray.splice(0, 100).join(',')
        const { data } = await getTracksAudioFeatures(trackIdString)
        data.audio_features.forEach(item => {
          let tempTrackVector = {
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
          if (item !== null) {
            similar.createTrackObject(tempTrackVector, item)
            const trackVectorArray = similar.convertObjectToVector(tempTrackVector)
            
            let similarity = 0
            if (similarityMethod === 0) {
              similarity = similar.calculateCosineSimilarity(vector, trackVectorArray)
            } else {
              similarity = similar.calculateOwnSimilarity(vector, trackVectorArray)
            }
            tempTracks.push({ id: item.id, similarity: similarity})
          }
        })
      }
      console.log(tempTracks)
    }
    getAllTracks()
  }, [])
  
  return (
    <div className='track-container'>
      <div className="tracks">
      </div>
    </div>
  )
}

export default TrackContainer