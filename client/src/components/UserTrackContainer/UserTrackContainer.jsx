import React, { useEffect, useState, useRef } from 'react'
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
  similarity,
  similarityMethod,
  playlistId,
  vector,
  setPopupIsOpen,
  user,
  setUserTrack,
  filterSimilarity,
  refresh
}) {
  const [tracks, setTracks] = useState(null)
  const [displayTracks, setDisplayTracks] = useState([])
  const [trackDetails, setTrackDetails] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [numTracks, setNumTracks] = useState(6)
  const [refreshTrack, setRefreshTrack] = useState(false)
  const track = new Tracks()
  const similar = new Similarity()
  const containerRef = useRef()

  /* calculate similarity score for each track and sort */
  /* implement filter by similarity score option */
  useEffect(() => {
    const getAllTracks = async () => {
      setIsLoading(true)

      /* get all tracks in a user's playlist */
      const allTracks = await track.getAllPlaylistTracks(playlistId)

      /* gets track audio features for each track */
      const trackIdArray = allTracks.map(item => {
        if (item.track !== null) {
          return item.track.id
        }
      })

      /* initialize tracks array */
      const tempTracks = []

      while (trackIdArray.length > 0) {
        const trackIdString = trackIdArray.splice(0, 100).join(',')
        const { data } = await getTracksAudioFeatures(trackIdString)
        const promises = data.audio_features.map(async (item) => {
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
            track.createTrackObject(tempTrackVector, item)

            const similarity = await similar.getSimilarityScore(similarityMethod, vector, tempTrackVector)
            tempTracks.push({ id: item.id, similarity, vector: tempTrackVector, added: true })
          }
        })
        await Promise.all(promises)
      }
      /* sort tempTracks by similarity score */
      tempTracks.sort((a, b) => {
        return b.similarity - a.similarity
      })

      const trackDetailArray = await track.getAllTrackDetails(tempTracks)
      setTrackDetails(trackDetailArray)
      setTracks(tempTracks)
      setDisplayTracks(tempTracks?.slice(0, numTracks))

      setIsLoading(false)
    }
    getAllTracks()
  }, [refresh])

  useEffect(() => {
    if (tracks && trackDetails) {
      const tempTracks = displayTracks.slice().reverse()
      const trackDetailArray = trackDetails.slice().reverse()
      setTrackDetails(trackDetailArray)
      setDisplayTracks(tempTracks)
      setRefreshTrack(!refreshTrack)
    }
  }, [filterSimilarity])

  useEffect(() => {
    setDisplayTracks(tracks?.slice(0, numTracks))
  }, [numTracks])

  const handleOnScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current

      /* when user scrolls to bottom of div */
      if (scrollTop + clientHeight >= (scrollHeight - 0.5)) {
        setNumTracks(numTracks + 6)
      }
    }
  }

  return (
    <div className="user-track-container"
      onScroll={handleOnScroll}
      ref={containerRef}
    >
      <div className="tracks">
        {!isLoading
          ? displayTracks?.map((item, idx) => (
          <UserTrack
            key={idx}
            similarityScore={item.similarity}
            similarityMethod={similarityMethod === 0 ? 'cosine similarity' : 'own similarity'}
            trackNumber={idx}
            item={item}
            playlistId={originalPlaylistId}
            playlistSimilarity={similarity}
            track={trackDetails[idx]}
            vector={vector}
            user={user}
            userTrackVector={item.vector}
            setPopupIsOpen={setPopupIsOpen}
            setUserTrack={setUserTrack}
            refresh={refreshTrack}
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
