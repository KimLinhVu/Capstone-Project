import React from 'react'
import { useState, useEffect } from 'react'
import { getArtistDetail } from '../../utils/spotify'
import './GenreContainer.css'

function GenreContainer({
  tracks
}) {
  const [genreArray, setGenreArray] = useState([])
  const [topFiveGenres, setTopFiveGenres] = useState([])

  useEffect(() => {
    const getArtistGenres = async () => {
      /* creates array of artist ids as a parameter for Spotify API */
      const artistArray = tracks.flatMap(item => (
        item.track.artists.map(artist => {
          return artist.id
        })
      )).flat()
  
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

  useState(() => {
    setTopFiveGenres(genreArray.slice(0, 5))
  }, [genreArray])
  return (
    <div className="genre-container">
      <div className="genres">
        {topFiveGenres.map((item, idx) => {
          return <button key={idx}>{item.genre}</button>
        })}
      </div>
    </div>
  )
}

export default GenreContainer