import React from 'react'
import { useEffect } from 'react'
import { getTrackDetail, getArtistDetail } from '../../spotify'

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
    const newArray = genreArray
    genres.forEach(genre => {
      if (genreArray.hasOwnProperty(genre)) {
        console.log(genre)
      } else {
        newArray.push({ })
      }
    })
  }
  
  return (
    <div className="track-card">
      <span>{trackNumber + 1}</span>
      <h1>{track.name}</h1>
      <img src={track.album.images[0].url} alt="Track Image"/>
    </div>
  )
}

export default Track