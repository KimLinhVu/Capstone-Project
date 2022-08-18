import React, { useState, useEffect } from 'react'
import { useParams, useLocation } from 'react-router-dom'
import { getCurrentUserProfile, getPlaylistDetail } from 'utils/spotify'
import UserTrackContainer from 'components/UserTrackContainer/UserTrackContainer'
import NavBar from 'components/NavBar/NavBar'
import ReactLoading from 'react-loading'
import ChartPopup from 'components/ChartPopup/ChartPopup'
import { IoMdArrowDropdown, IoMdArrowDropup } from 'react-icons/io'
import Dropdown from 'components/Dropdown/Dropdown'
import UserProfileCard from 'components/UserProfileCard/UserProfileCard'
import Tracks from 'utils/tracks'
import './UserPlaylistDetail.css'
import { getUserProfile } from 'utils/users'
import { getSimilarityScore } from 'utils/playlist'
import CommentContainer from 'components/CommentContainer/CommentContainer'

function UserPlaylistDetail () {
  const [userPlaylist, setUserPlaylist] = useState(null)
  const [userTrack, setUserTrack] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [popupIsOpen, setPopupIsOpen] = useState(false)
  const [profilePopup, setProfilePopup] = useState(false)
  const [filterSimilarity, setFilterSimilarity] = useState(false)
  const [selected, setSelected] = useState('')
  const [currentAddPlaylist, setCurrentAddPlaylist] = useState(null)
  const [options, setOptions] = useState(null)
  const [refresh, setRefresh] = useState(false)
  const [profile, setProfile] = useState(null)
  const [spotifyProfile, setSpotifyProfile] = useState(null)
  const { playlistId } = useParams()
  const location = useLocation()
  const { similarity, similarityMethod, originalPlaylistId, user, vector, userVector } = location?.state
  const [currentPlaylistId, setCurrentPlaylistId] = useState(originalPlaylistId)
  const [currentVector, setCurrentVector] = useState(vector)
  const [currentSimilarity, setCurrentSimilarity] = useState(similarity)
  const [userId, setUserId] = useState(user._id)
  const track = new Tracks()

  let filterSimilarityButton

  useEffect(() => {
    /* get current user profile and spotifyProfile */
    const getProfiles = async () => {
      setIsLoading(true)
      const { data } = await getCurrentUserProfile()
      setSpotifyProfile(data)

      const res = await getUserProfile()
      setProfile(res)
      setIsLoading(false)
    }
    const fetchPlaylist = async () => {
      const { data } = await getPlaylistDetail(playlistId)
      setUserPlaylist(data)

      const res = await getPlaylistDetail(originalPlaylistId)
      setPlaylist(res.data)
      setSelected(res.data.name)
    }
    const getDropdownOptions = async () => {
      setIsLoading(true)

      const result = await track.createOptions(true)
      setOptions(result)

      setIsLoading(false)
    }
    const getCurrentSimilarity = async () => {
      const { data } = await getSimilarityScore(originalPlaylistId, playlistId, similarityMethod)
      setCurrentSimilarity(data.toFixed(2))
    }
    getCurrentSimilarity()
    getProfiles()
    fetchPlaylist()
    getDropdownOptions()
  }, [])

  /* changes which playlist to add track to */
  useEffect(() => {
    if (currentAddPlaylist === null) {
      setCurrentPlaylistId(originalPlaylistId)
    } else {
      setCurrentPlaylistId(currentAddPlaylist.playlistId)
      setCurrentVector(currentAddPlaylist.trackVector)

      /* get similarity score between new playlist */
      const updateSimilarityScore = async () => {
        const { data } = await getSimilarityScore(currentAddPlaylist.playlistId, playlistId, similarityMethod)
        setCurrentSimilarity(data.toFixed(2))
      }
      updateSimilarityScore()
      setRefresh(!refresh)
    }
  }, [currentAddPlaylist])

  /* prevent scrolling when popup is open */
  useEffect(() => {
    if (popupIsOpen || profilePopup) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [popupIsOpen, profilePopup])

  const handleViewFeaturesOnClick = () => {
    setPopupIsOpen(true)
    setUserTrack({ vector: userVector, name: userPlaylist.name })
  }

  if (filterSimilarity) {
    filterSimilarityButton = <IoMdArrowDropup className='filter' onClick={() => setFilterSimilarity(false)}/>
  } else {
    filterSimilarityButton = <IoMdArrowDropdown className='filter' onClick={() => setFilterSimilarity(true)}/>
  }

  return (
    <div className="user-playlist-detail">
      <NavBar />
      <div className="content">
        {userPlaylist && !isLoading
          ? <>
            <div className="header">
              <img src={userPlaylist.images[0].url} alt="Playlist Cover" />
              <div className="playlist-header-info">
                <p className='header-tag'>PLAYLIST</p>
                <h2>{userPlaylist.name}</h2>
                <p className='header-tag'>Owner: {userPlaylist.owner.display_name}</p>
                <div className="buttons">
                  <button onClick={handleViewFeaturesOnClick} className='view-features'>View Audio Features</button>
                  <button className='follow' onClick={() => setProfilePopup(true)}>{user.username}&apos;s Profile</button>
                </div>
              </div>
              <div className="similarity-score">
                <p className='header-tag'>SIMILARITY</p>
                <button className='current-similarity'>{currentSimilarity}</button>
              </div>
            </div>
            <div className="playlist-detail-content">
              <div className="right">
                <div className="dropdown-container">
                  <p className='add-playlist'>Add to Playlist</p>
                  <Dropdown
                    options={options}
                    selected={selected}
                    setSelected={setSelected}
                    setCurrentAddPlaylist={setCurrentAddPlaylist}
                    isLoading={isLoading}
                  />
                </div>
                <div className="track-header">
                  <span className="num">#</span>
                  <span className="title">Title</span>
                  <div className='similarity-container'>
                    <span>Similarity</span>
                    {filterSimilarityButton}
                  </div>
                  <span className="preview">Preview</span>
                </div>
                <hr></hr>
                <div className="tracks">
                  <UserTrackContainer
                    tracks={userPlaylist.tracks.items}
                    addPlaylist={true}
                    playlistId={playlistId}
                    user={user}
                    originalPlaylistId={currentPlaylistId}
                    vector={currentVector}
                    similarityMethod={similarityMethod}
                    setPopupIsOpen={setPopupIsOpen}
                    setUserTrack={setUserTrack}
                    filterSimilarity={filterSimilarity}
                    refresh={refresh}
                  />
                </div>
                <div className="comments">
                  <CommentContainer
                    userId={profile.data._id}
                    otherUserId={user._id}
                    playlistId={playlistId}
                    setPopupIsOpen={setProfilePopup}
                    setUserId={setUserId}
                  />
                </div>
              </div>
            </div>
          </>
          : <ReactLoading color='#B1A8A6' type='spin' className='playlist-loading'/>}
      </div>
      {popupIsOpen && userTrack &&
        <ChartPopup
          setPopupIsOpen={setPopupIsOpen}
          trackVector={currentVector}
          userTrack={userTrack}
          playlistName={currentAddPlaylist === null ? playlist.name : currentAddPlaylist.playlist.name}
        />
      }
      {profilePopup && profile && spotifyProfile &&
        <UserProfileCard
          setPopupIsOpen={setProfilePopup}
          userId={userId}
          currentProfile={profile}
          spotifyProfile={spotifyProfile}
        />}
    </div>
  )
}

export default UserPlaylistDetail
