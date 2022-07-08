import { logout } from '../spotify'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const Protected = ({token, children}) => {
  const navigate = useNavigate()
  useEffect(() => {
    axios.post('http://localhost:8888/verify-token', {
      token: token
    }).then(res => {
      console.log(res)
      if (!res.data.auth) {
        logout()
        console.log('here')
        navigate('/login')
      }
    })
  }, [])
  
  return children
}