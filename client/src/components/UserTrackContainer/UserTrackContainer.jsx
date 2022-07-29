import React, { useEffect, useState } from 'react'
import Tracks from 'utils/tracks'
import UserTrack from 'components/UserTrack/UserTrack'
import { getTracksAudioFeatures } from 'utils/spotify'
import { ToastContainer } from 'react-toastify'
import Similarity from 'utils/similarity'
import ReactLoading from 'react-loading'
import 'react-toastify/dist/ReactToastify.css'
import './UserTrackContainer.css'

function UserTrackContainer ({
  originalPlaylistId,
  similarityMethod,
  playlistId,
  vector,
  setPopupIsOpen,
  setUserTrack
}) {
  const [tracks, setTracks] = useState(null)
  const [trackDetails, setTrackDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const track = new Tracks()
  const similar = new Similarity()

  /* calculate similarity score for each track and sort */
  /* implement filter by similarity score option */
  useEffect(() => {
    const getAllTracks = async () => {
      setIsLoading(true)
      /* get all tracks in a user's playlist */
      const allTracks = await track.getAllPlaylistTracks(playlistId)

      /* gets track audio features for each track */
      const trackIdArray = allTracks.map(item => {
        return item.track.id
      })

      /* initialize tracks array */
      const tempTracks = []

      while (trackIdArray.length > 0) {
        const trackIdString = trackIdArray.splice(0, 100).join(',')
        const { data } = await getTracksAudioFeatures(trackIdString)
        data.audio_features.forEach(item => {
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
          if (item !== null) {
            similar.createTrackObject(tempTrackVector, item)

            let similarity = 0
            if (similarityMethod === 0) {
              similarity = similar.calculateCosineSimilarity(vector, tempTrackVector)
            } else {
              similarity = similar.calculateOwnSimilarity(vector, tempTrackVector)
            }
            tempTracks.push({ id: item.id, similarity, vector: tempTrackVector })
          }
        })
      }
      /* sort tempTracks by similarity score */
      tempTracks.sort((a, b) => {
        return b.similarity - a.similarity
      })
      const trackDetailArray = await track.getAllTrackDetails(tempTracks)
      setTrackDetails(trackDetailArray)
      setTracks(tempTracks)

      setIsLoading(false)
    }
    getAllTracks()
  }, [])

  return (
    <div className="user-track-container">
      <div className="tracks">
        {!isLoading
          ? tracks?.map((item, idx) => (
          <UserTrack
            key={idx}
            similarityScore={item.similarity}
            similarityMethod={similarityMethod === 0 ? 'cosine similarity' : 'own similarity'}
            trackNumber={idx}
            playlistId={originalPlaylistId}
            track={trackDetails[idx]}
            vector={vector}
            userTrackVector={item.vector}
            setPopupIsOpen={setPopupIsOpen}
            setUserTrack={setUserTrack}
          />
          ))
          : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default UserTrackContainer
