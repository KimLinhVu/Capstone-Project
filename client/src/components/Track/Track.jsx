import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { getTrackDetail, getArtistDetail, accessToken, addTrackToPlaylist } from '../../utils/spotify'
import './Track.css'

function Track({
  track,
  trackNumber,
  genreArray,
  setGenreArray,
  addPlaylist,
  playlistId
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
    })
    /* sorts genre array by count */
    newArray.sort((a, b) => {
      return b.count - a.count
    })
    setGenreArray(newArray)
  }

  const addTrack = async () => {
    try {
      const res = await addTrackToPlaylist(playlistId, track.uri)
      console.log(res)
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="track">
      <span>{trackNumber + 1}</span>
      <p>{track.name}</p>
      <img src={track.album.images[0].url} alt="Track Image"/>
      {addPlaylist ? <button onClick={addTrack}>Add Song To Playlist</button> : null}
    </div>
  )
}

export default Track