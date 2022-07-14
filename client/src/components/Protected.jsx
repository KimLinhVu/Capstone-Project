import { logout } from '../utils/spotify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const Protected = ({token, children}) => {
  const navigate = useNavigate()
  useEffect(() => {
    axios.post('http://localhost:8888/verify-token', {
      token: token
    }).then(() => {
      /* do nothing if successfully authenticated */
    }).catch(() => {
      /* do an alert in bootstrap */
      navigate('/login')
    })
  }, [])
  
  return children
}