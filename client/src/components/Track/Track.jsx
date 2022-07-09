import React from 'react'
import { useEffect } from 'react'
import { getTrackDetail, getArtistDetail } from '../../spotify'
import './Track.css'

function Track({
  track,
  trackNumber,
  genreArray,
  setGenreArray
}) {
  useEffect(() => {

    /* gets the genres associated with the artists for each track */
    const getTrackGenre = async () => {
      const { data } = await getTrackDetail(track.id)
      const artists = data.artists
      artists.forEach(async (artist) => {
        const { data } = await getArtistDetail(artist.id)
        addGenreToArray(data.genres)
      })
    }
    getTrackGenre()
  }, [])

  const addGenreToArray = (genres) => {
    let newArray = genreArray
    genres.forEach(genre => {
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
      setGenreArray(newArray)
    })
  }
  
  return (
    <div className="track">
      <span>{trackNumber + 1}</span>
      <p>{track.name}</p>
      <img src={track.album.images[0].url} alt="Track Image"/>
    </div>
  )
}

export default Track