import React, { useState, useEffect, createContext } from 'react'
import { accessToken, getCurrentUserProfile } from 'utils/spotify'
import { getCurrentPlaylists } from 'utils/playlist'
import PlaylistView from 'components/PlaylistView/PlaylistView'
import FavoriteView from 'components/FavoriteView/FavoriteView'
import ProfileCard from 'components/ProfileCard/ProfileCard'
import Tracks from 'utils/tracks'
import { getUserProfile } from 'utils/users'
import FollowersView from 'components/FollowersView/FollowersView'
import './Dashboard.css'
import UserProfileCard from 'components/UserProfileCard/UserProfileCard'

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
  const [popupIsOpen, setPopupIsOpen] = useState(false)
  const [userPopupId, setUserPopupId] = useState(null)

  const track = new Tracks()

  /* get value of tokens out of the URL */
  useEffect(() => {
    setSpotifyToken(accessToken)
    const fetchUserProfiles = async () => {
      const { data } = await getCurrentUserProfile()
      setSpotifyProfile(data)

      const res = await getUserProfile()
      setProfile(res.data)
    }
    if (accessToken) {
      fetchUserProfiles()
    }
  }, [refresh])

  useEffect(() => {
    const addUserPlaylist = async () => {
      /* get user's profile */
      const prof = await getCurrentUserProfile()

      /* retrieve playlist that belongs to user and store in playlist state */
      const result = await track.createOptions(false)
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
    }
    if (accessToken) {
      addUserPlaylist()
    }
  }, [currentAddPlaylist, refresh])

  useEffect(() => {
    /* displays playlists included in search input */
    const newArray = currentPlaylist?.filter(item => { return item.playlist.name.toLowerCase().includes(playlistSearch.toLowerCase()) })
    setDisplayPlaylist(newArray)
  }, [playlistSearch])

  /* prevent scrolling when popup is open */
  useEffect(() => {
    if (popupIsOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'scroll'
    }
  }, [popupIsOpen])

  const closeAllTabs = () => {
    setPlaylistShow(false)
    setFavoriteShow(false)
    setFollowersShow(false)
    setFollowingShow(false)
  }

  return (
    <DashboardContext.Provider value={{ setRefresh, refresh }}>
      <div className="dashboard">
        {spotifyToken
          ? (
        <>
          <div className="carousel">
            {/* Background Image */}
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
                  setFavoriteShow(true)
                }} className={`${favoriteShow ? 'tab-show' : ''}`}>Favorites</button>
                <button onClick={() => {
                  closeAllTabs()
                  setFollowersShow(true)
                }} className={`${followersShow ? 'tab-show' : ''}`}>Followers</button>
                <button onClick={() => {
                  closeAllTabs()
                  setFollowingShow(true)
                }} className={`${followingShow ? 'tab-show' : ''}`}>Following</button>
              </div>
              <hr />
            </div>
            <div className={`playlist-tab ${playlistShow ? 'show' : ''}`}>
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
              />
            </div>
            <div className={`favorites-tab ${favoriteShow ? 'show' : ''}`}>
              {spotifyProfile && profile && (
                <FavoriteView
                  refresh={refresh}
                  setRefresh={setRefresh}
                  spotifyProfile={spotifyProfile}
                  profile={profile}
                />
              )}
            </div>
            <div className={`followers-tab ${followersShow ? 'show' : ''}`}>
              {profile && (
                <FollowersView
                  profile={profile}
                  followers={true}
                  setPopupIsOpen={setPopupIsOpen}
                  setUserPopupId={setUserPopupId}
                />
              )}
            </div>
            <div className={`followers-tab ${followingShow ? 'show' : ''}`}>
              {profile && (
                  <FollowersView
                    profile={profile}
                    followers={false}
                    setPopupIsOpen={setPopupIsOpen}
                    setUserPopupId={setUserPopupId}
                  />
              )}
            </div>
          </div>
        </>)
          : (
            <div className="spotify">
              <div className="content">
                <a className="spotify-link" href={`${process.env.REACT_APP_BASE_URL}/spotify/login/`}>Log Into Spotify Account</a>
              </div>
            </div>
            )}
        {popupIsOpen && userPopupId && <UserProfileCard setPopupIsOpen={setPopupIsOpen} userId={userPopupId} currentProfile={profile} spotifyProfile={spotifyProfile}/>}
      </div>
    </DashboardContext.Provider>
  )
}

export default Dashboard
