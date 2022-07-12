import React from 'react'
import { useState, useEffect } from 'react'
import { getAllUsers, getUserPlaylists } from '../../utils/users'
import { useParams } from 'react-router-dom'
import { getPlaylistTrackVector } from '../../utils/playlist'
import { convertObjectToVector, calculateTrackSimilarity } from '../../utils/similarity'
import UserPlaylist from '../UserPlaylist/UserPlaylist'

function RecommendView() {
  const [playlists, setPlaylists] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { playlistId } = useParams()

  useEffect(() => {
    const fetchUserTrackVector = async () => {
      /* fetches playlist track vector */
      const { data } = await getPlaylistTrackVector(playlistId)
      const vector = convertObjectToVector(data)

      /* fetches track vectors from other users' playlists and 
      calculates a similarity score */
      const result = await getAllUsers()

      /* calcualte similarity score for each user's playlists */
      result.data.forEach(async (user) => {
        const { data } = await getUserPlaylists(user._id)
        data?.forEach(playlist => {
          const userVector = convertObjectToVector(playlist.trackVector)
          const similarity = calculateTrackSimilarity(vector, userVector)
          const newTrackObject = { user: user, playlist: playlist, similarityScore: similarity}
          setPlaylists(old => [...old, newTrackObject])
        })
      })
    }
    fetchUserTrackVector()
  }, [])

  return (
    <div className="recommend-view">
      <h1>Recommend View</h1>
      {playlists ? (
        <div className="users">
          {playlists?.map((item, idx) => {
            return (
              <UserPlaylist 
                key={idx}
                user={item.user}
                playlist={item.playlist.playlist}
                similarity={item.similarityScore.toFixed(2)}
                userId={item.playlist.userId}
                playlistId={playlistId}
              />
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default RecommendView