import React from 'react'
import { useEffect, useState } from 'react'
import { getFavoritePlaylists } from 'utils/playlist'
import PlaylistCard from '../PlaylistCard/PlaylistCard'
import ReactLoading from 'react-loading'
import './FavoriteView.css'

function FavoriteView({
  spotifyProfile,
  refresh,
  setRefresh
}) {

  const [displayFavorites, setDisplayFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPlaylists = async () => {
      setIsLoading(true)
      const { data } = await getFavoritePlaylists(spotifyProfile.id)
      setDisplayFavorites(data)
      setIsLoading(false)
    }
    fetchPlaylists()
  }, [refresh])
  
  return (
    <div className="favorite-view">
      <div className='playlist-container'>
        <div className="header">
          <h3>{spotifyProfile.display_name}'s Favorites</h3>
        </div>
        {displayFavorites && !isLoading ? (
          <div className="playlists">
          {displayFavorites.length !== 0 ? displayFavorites.map((item, idx) => (
            <PlaylistCard 
              key={idx}
              favorite={item.favorite}
              playlist={item.playlist}
              refresh={refresh}
              setRefresh={setRefresh}
              setIsLoading={setIsLoading}
            />
          )) : <p>No Favorites Found</p>}
        </div>) : <ReactLoading color='#B1A8A6' type='spin' className='loading'/>}
      </div>
    </div>
  )
}

export default FavoriteView