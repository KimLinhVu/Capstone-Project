import React, { useEffect } from 'react'
import Track from '../Track/Track'
import { useState } from 'react'
import { getArtistDetail } from 'utils/spotify'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './TrackContainer.css'

function TrackContainer({
  tracks,
  addPlaylist,
  playlistId
}) {
  const [genreArray, setGenreArray] = useState([])

  useEffect(() => {
    const getArtistGenres = async () => {
      /* creates array of artist ids as a parameter for Spotify API */
      let artistArray = []
      tracks.forEach(item => {
        const artists = item.track.artists
        artists.forEach(item => {
          artistArray.push(item.id)
        })
      })
  
      while (artistArray.length > 0) {
        /* requests artist information in increments of 50 */
        let newArray = genreArray
        let artistString = artistArray.splice(0, 50).join(',')
        const { data } = await getArtistDetail(artistString)
        
        /* counts number of times each genre appears */
        data.artists.forEach(item => {
          item.genres.forEach(genre => {
            let found = false
            newArray.forEach(item => {
              if (item.genre === genre) {
                item.count += 1
                found = true
              }
            })
            if (!found) {
              const newGenre = { genre: genre, count: 0}
              newArray.push(newGenre)
            }
          })
        })
        newArray.sort((a, b) => {
          return b.count - a.count
        })
        setGenreArray(oldArray => [...oldArray, newArray])
      }
    }
    getArtistGenres()
  }, [])

  return (
    <div className="track-container">
      <div className="genres">
        <h2>Top Genres in Playlist</h2>
        {genreArray.slice(0, 5).map((item, idx) => {
          return <p key={idx}>{item.genre}</p>
        })}
      </div>
      <div className="tracks">
        {tracks.map((item, idx) => (
          <Track 
            key={idx} 
            track={item.track} 
            trackNumber={idx}
            addPlaylist={addPlaylist}
            playlistId={playlistId}
          />
        ))}
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

export default TrackContainer