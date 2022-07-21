import React from 'react'
import { useState, useEffect } from 'react'
import { getArtistDetail } from '../../utils/spotify'
import './GenreContainer.css'

function GenreContainer({
  tracks
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
    <div className="genre-container">
      <div className="genres">
        {genreArray.slice(0, 5).map((item, idx) => (
          <button key={idx}>{item.genre}</button>
        ))}
      </div>
    </div>
  )
}

export default GenreContainer