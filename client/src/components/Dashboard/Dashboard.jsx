import React, { useState, useEffect, createContext } from 'react'
import { getCurrentUserProfile, getSpotifyAccessTokens } from 'utils/spotify'
import { getCurrentPlaylists } from 'utils/playlist'
import PlaylistView from 'components/PlaylistView/PlaylistView'
import FavoriteView from 'components/FavoriteView/FavoriteView'
import ProfileCard from 'components/ProfileCard/ProfileCard'
import Track from 'utils/tracks'
import { getUserProfile } from 'utils/users'
import FollowersView from 'components/FollowersView/FollowersView'
import { ToastContainer } from 'react-toastify'
import { notifyError } from 'utils/toast'
import { useNavigate } from 'react-router-dom'
import { Tooltip } from '@mui/material'
import Image from 'utils/image'
import { MdOutlineEdit } from 'react-icons/md'
import './Dashboard.css'
import UserProfileCard from 'components/UserProfileCard/UserProfileCard'
import RecentlyAddedView from 'components/RecentlyAddedView/RecentlyAddedView'

export const DashboardContext = createContext()

function Dashboard () {
  const [spotifyToken, setSpotifyToken] = useState(null)
  const [profile, setProfile] = useState(null)
  const [spotifyProfile, setSpotifyProfile] = useState(null)
  const [playlist, setPlaylist] = useState(null)
  const [currentPlaylist, setCurrentPlaylist] = useState([])
  const [displayPlaylist, setDisplayPlaylist] = useState([])
  const [currentAddPlaylist, setCurrentAddPlaylist] = useState(null)
  const [selected, setSelected] = useState('Add A Playlist')
  const [playlistSearch, setPlaylistSearch] = useState('')
  const [refresh, setRefresh] = useState(false)
  const [playlistShow, setPlaylistShow] = useState(true)
  const [favoriteShow, setFavoriteShow] = useState(false)
  const [followersShow, setFollowersShow] = useState(false)
  const [followingShow, setFollowingShow] = useState(false)
  const [recentlyAddedShow, setRecentlyAddedShow] = useState(false)
  const [popupIsOpen, setPopupIsOpen] = useState(false)
  const [userPopupId, setUserPopupId] = useState(null)
  const [disableTab, setDisableTab] = useState(true)
  const [showEdit, setShowEdit] = useState(false)
  const [backgroundPicture, setBackgroundPicture] = useState(null)

  /* get value of tokens out of the URL */
  useEffect(() => {
    const getSpotifyToken = async () => {
      const token = await getSpotifyAccessTokens()
      setSpotifyToken(token)
      fetchUserProfiles()
    }
    const fetchUserProfiles = async () => {
      const { data } = await getCurrentUserProfile()
      setSpotifyProfile(data)

      const res = await getUserProfile()
      setProfile(res.data)
    }
    const getBackground = async () => {
      const { data } = await Image.getBackgroundPicture()
      if (data !== null) {
        setBackgroundPicture(data)
      }
    }
    getSpotifyToken()
    getBackground()
  }, [refresh])

  useEffect(() => {
    const addUserPlaylist = async () => {
      /* get user's profile */
      const prof = await getCurrentUserProfile()

      /* retrieve playlist that belongs to user and store in playlist state */
      const result = await Track.createOptions(false)
      setPlaylist(result)

      /* retrieve playlists that spotify user has added to their profile */
      const currentResult = await getCurrentPlaylists(prof.data.id)

      /* sort playlists alphabetically */
      currentResult.data.sort((a, b) => {
        if (a.playlist.name.toLowerCase() < b.playlist.name.toLowerCase()) { return -1 }
        if (a.playlist.name.toLowerCase() > b.playlist.name.toLowerCase()) { return 1 }
        return 0
      })
      setCurrentPlaylist(currentResult.data)
      setDisplayPlaylist(currentResult.data)

      currentResult.data.length === 0 ? setDisableTab(true) : setDisableTab(false)
    }
    addUserPlaylist()
  }, [currentAddPlaylist, refresh])

  useEffect(() => {
    /* displays playlists included in search input */
    const newArray = currentPlaylist?.filter(item => { return item.playlist.name.toLowerCase().includes(playlistSearch.toLowerCase()) })
    setDisplayPlaylist(newArray)
  }, [playlistSearch])

  /* prevent scrolling when popup is open */
  useEffect(() => {
    popupIsOpen ? document.body.style.overflow = 'hidden' : document.body.style.overflow = 'scroll'
  }, [popupIsOpen])

  const closeAllTabs = () => {
    setPlaylistShow(false)
    setFavoriteShow(false)
    setFollowersShow(false)
    setFollowingShow(false)
    setRecentlyAddedShow(false)

    if (disableTab) {
      setPlaylistShow(true)
      notifyError('Please add one playlist to your profile')
    }
  }

  return (
    <DashboardContext.Provider value={{ setRefresh, refresh }}>
      <div className="dashboard">
        {spotifyToken
          ? (
        <>
          <div className="background-header" onMouseEnter={() => setShowEdit(true)} onMouseLeave={() => setShowEdit(false)}>
            <div className="edit-background">
              <label className={showEdit ? 'upload-image' : 'upload-image disable'}>
                <Tooltip title='Change background image'><MdOutlineEdit size={40} className='edit'/></Tooltip>
                <input
                  id='image'
                  type="file"
                  accept="image/*"
                  onChange={e => Image.uploadBackgroundImage(e, refresh, setRefresh)}
                />
              </label>
            </div>
            {backgroundPicture ? <img src={backgroundPicture}/> : <img src={require('img/lily.jpeg')} />}
          </div>
          {spotifyProfile &&
            <ProfileCard
              spotifyProfile={spotifyProfile}
              profile={profile}
            />
          }
          <div className="dashboard-right">
            <div className="nav">
              <div className="links">
                <button onClick={() => {
                  closeAllTabs()
                  setPlaylistShow(true)
                }} className={`${playlistShow ? 'tab-show' : ''}`}>Playlists</button>
                <button onClick={() => {
                  closeAllTabs()
                  disableTab ? setFavoriteShow(false) : setFavoriteShow(true)
                }} className={`${favoriteShow ? 'tab-show' : ''}`}>Favorites</button>
                <button onClick={() => {
                  closeAllTabs()
                  disableTab ? setFollowersShow(false) : setFollowersShow(true)
                }} className={`${followersShow ? 'tab-show' : ''}`}>Followers</button>
                <button onClick={() => {
                  closeAllTabs()
                  disableTab ? setFollowingShow(false) : setFollowingShow(true)
                }} className={`${followingShow ? 'tab-show' : ''}`}>Following</button>
                <button onClick={() => {
                  closeAllTabs()
                  disableTab ? setRecentlyAddedShow(false) : setRecentlyAddedShow(true)
                }} className={`${recentlyAddedShow ? 'tab-show' : ''}`}>Recently Added</button>
              </div>
              <hr />
            </div>
            <div className={`playlist-tab ${playlistShow ? 'show' : ''}`}>
              {playlistShow &&
                <PlaylistView
                  playlist={playlist}
                  selected={selected}
                  setSelected={setSelected}
                  setCurrentAddPlaylist={setCurrentAddPlaylist}
                  currentAddPlaylist={currentAddPlaylist}
                  playlistSearch={playlistSearch}
                  setPlaylistSearch={setPlaylistSearch}
                  displayPlaylist={displayPlaylist}
                  setPlaylist={setPlaylist}
                  spotifyName={spotifyProfile?.display_name}
                  refresh={refresh}
                  setRefresh={setRefresh}
                />}
            </div>
            <div className={`favorites-tab ${favoriteShow ? 'show' : ''}`}>
              {spotifyProfile && profile && favoriteShow && (
                <FavoriteView
                  refresh={refresh}
                  setRefresh={setRefresh}
                  spotifyProfile={spotifyProfile}
                  profile={profile}
                />
              )}
            </div>
            <div className={`followers-tab ${followersShow ? 'show' : ''}`}>
              {profile && followersShow && (
                <FollowersView
                  profile={profile}
                  followers={true}
                  setPopupIsOpen={setPopupIsOpen}
                  setUserPopupId={setUserPopupId}
                />
              )}
            </div>
            <div className={`followers-tab ${followingShow ? 'show' : ''}`}>
              {profile && followingShow && (
                  <FollowersView
                    profile={profile}
                    followers={false}
                    setPopupIsOpen={setPopupIsOpen}
                    setUserPopupId={setUserPopupId}
                  />
              )}
            </div>
            <div className={`recently-added-tab ${recentlyAddedShow ? 'show' : ''}`}>
              {recentlyAddedShow &&
                <RecentlyAddedView
                  setPopupIsOpen={setPopupIsOpen}
                  setUserPopupId={setUserPopupId}
                />
              }
            </div>
          </div>
        </>)
          : (
            <div className="spotify">
              <div className="content">
                <a className="spotify-link" href={`${process.env.REACT_APP_BASE_URL}/spotify/login/`}>Link Spotify Account</a>
                <p className='required'>*must link Spotify account to use app</p>
                <button className='logout-btn' onClick={() => navigate('/login')}>Logout</button>
              </div>
            </div>
            )}
        {popupIsOpen && userPopupId && <UserProfileCard setPopupIsOpen={setPopupIsOpen} userId={userPopupId} currentProfile={profile} spotifyProfile={spotifyProfile}/>}
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
    </DashboardContext.Provider>
  )
}

export default Dashboard
