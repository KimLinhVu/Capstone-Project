import React, { useEffect, useState } from 'react'
import { addTrackToPlaylist, getPlaylistDetail, removeTrackFromPlaylist } from 'utils/spotify'
import { notifyError, notifySuccess } from 'utils/toast'
import { AiFillPlusCircle, AiFillMinusCircle } from 'react-icons/ai'
import { addSimilarityMethodCount, removeSimilarityMethodCount } from 'utils/playlist'
import Similarity from 'utils/similarity'
import './UserTrack.css'
import { addTrackRecord } from 'utils/addedTrack'
import { addSpotifyUri, getTrackDetails } from 'utils/shazam'

function UserTrack ({
  playlistId,
  playlistSimilarity,
  similarityScore,
  similarityMethod,
  trackNumber,
  track,
  item,
  vector,
  user,
  userTrackVector,
  setPopupIsOpen,
  setUserTrack,
  refresh
}) {
  const [disable, setDisable] = useState(false)
  const [trackPreview, setTrackPreview] = useState(null)
  const similar = new Similarity()
  let trackButton
  const similarityClassName = Similarity.getSimilarityColorClass(similarityScore)

  useEffect(() => {
    const trackId = track.id
    const trackSearchParams = track.name.concat(' ', track.artists[0].name).replaceAll(' ', '%20')
    const getPreviewUri = async () => {
      const { data } = await getTrackDetails(trackId, trackSearchParams)
      setTrackPreview(data)
    }
    const addPreviewUri = async () => {
      setTrackPreview(track.preview_url)
      await addSpotifyUri(trackId, track.preview_url)
    }
    if (track.preview_url === null) {
      getPreviewUri()
    } else {
      addPreviewUri()
    }
  }, [refresh])

  const addTrack = async () => {
    setDisable(true)
    const res = await addTrackToPlaylist(playlistId, track.uri)
    /* sends success or error toast */
    if (res.status === 201) {
      /* add to similarity method counter */
      await addSimilarityMethodCount(similarityMethod)
      notifySuccess('Track added successfully')
      item.added = false
    } else {
      notifyError('Error adding track')
    }

    /* update track factors */
    if (similarityMethod === 'own similarity') {
      await similar.recalculateTrackFactor(userTrackVector, vector)
    }

    /* save added track in database */
    const { data } = await getPlaylistDetail(playlistId)
    const playlistObject = {
      image: data.images[0].url,
      name: data.name,
      ownerName: data.owner.display_name
    }
    const trackObject = {
      image: track.album.images[0].url,
      name: track.name,
      artist: track.artists[0].name,
      trackUri: trackPreview
    }
    await addTrackRecord(trackObject, user._id, user.username, similarityScore, playlistObject, Date.now())

    setDisable(false)
  }

  const removeTrack = async () => {
    setDisable(true)
    const res = await removeTrackFromPlaylist(playlistId, track.uri)
    /* sends success or error toast */
    if (res.status === 200) {
      /* remove from similarity method counter */
      await removeSimilarityMethodCount(similarityMethod)
      notifySuccess('Track removed successfully')
      item.added = true
    } else {
      notifyError('Error removing track')
    }

    setDisable(false)
  }

  if (item.added) {
    trackButton = <AiFillPlusCircle onClick={(e) => {
      addTrack()
      e.stopPropagation()
    }} className={disable ? 'track-disable' : 'icon'} size={30} disable={disable}/>
  } else {
    trackButton = <AiFillMinusCircle onClick={(e) => {
      removeTrack()
      e.stopPropagation()
    }} className={disable ? 'track-disable' : 'icon'} size={30} disable={disable}/>
  }

  return (
    <div className="user-track" onClick={() => {
      setPopupIsOpen(true)
      setUserTrack({ vector: userTrackVector, name: track.name })
    }}>
      <span className='num'>{trackNumber + 1}</span>
      <div className="song">
        <img src={track.album.images[0].url} alt="Track Image"/>
        <div className="song-info">
          <span className='title'>{track.name}</span>
          <span className='artist'>{track.artists[0].name}</span>
        </div>
      </div>
      <div className="similarity">
        <span className={similarityClassName}>{similarityScore.toFixed(2)}</span>
      </div>
      <div className="preview">
        <audio controls src={trackPreview}></audio>
      </div>
      {trackButton}
    </div>
  )
}

export default UserTrack
