import React, { useEffect, useState } from 'react'
import { getFavoritePlaylists, getRandomUserPlaylist } from 'utils/playlist'
import PlaylistCard from 'components/PlaylistCard/PlaylistCard'
import './FavoriteView.css'
import { getFollowerFavorite, getUserProfileById } from 'utils/users'
import FollowerPlaylistCard from 'components/FollowerPlaylistCard/FollowerPlaylistCard'

function FavoriteView ({
  spotifyProfile,
  refresh,
  setRefresh,
  profile
}) {
  const [displayFavorites, setDisplayFavorites] = useState([])
  const [userFavorites, setUserFavorites] = useState(null)
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [originalPlaylistId, setOriginalPlaylistId] = useState(null)
  const [vector, setVector] = useState(null)

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true)
      const { data } = await getFavoritePlaylists(spotifyProfile.id)
      setDisplayFavorites(data)

      const result = await getFollowerFavorite()
      setUserFavorites(result.data)

      const userArray = []
      const promises = result.data.map(async (item) => {
        const { data } = await getUserProfileById(item.playlist.userId)
        userArray.push(data)
      })
      Promise.all(promises)
      setUserDetails(userArray)

      const random = await getRandomUserPlaylist(spotifyProfile.id)
      setOriginalPlaylistId(random.data.playlistId)
      setVector(random.data.trackVector)

      setIsLoading(false)
    }
    fetchPlaylists()
  }, [refresh])

  return (
    <div className="favorite-view">
      <div className='playlist-container'>
        <div className="header">
          <h3>{spotifyProfile.display_name}&apos;s Favorites</h3>
        </div>
        <div className="playlists">
        {displayFavorites?.length !== 0
          ? displayFavorites?.map((item, idx) => (
          <PlaylistCard
            key={idx}
            favorite={item.favorite}
            playlist={item.playlist}
            refresh={refresh}
            setRefresh={setRefresh}
            setIsLoading={setIsLoading}
          />
          ))
          : <p>No Favorites Found</p>}
        </div>
      </div>
      <div className="playlist-container">
        <div className="header">
          <h3>Other Favorites</h3>
        </div>
        <div className="playlists">
          {userFavorites?.length !== 0 && userDetails
            ? userFavorites?.map((item, idx) => {
              return (
                <FollowerPlaylistCard
                  key={idx}
                  playlist={item.playlist.playlist}
                  item={item.playlist}
                  user={userDetails[idx]}
                  profile={profile}
                  originalPlaylistId={originalPlaylistId}
                  vector={vector}
                />
              )
            })
            : <p>No User Favorites Found</p>}
        </div>
      </div>
    </div>
  )
}

export default FavoriteView
