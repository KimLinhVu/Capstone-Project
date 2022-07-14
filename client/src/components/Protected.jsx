import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export const Protected = ({
  token, 
  children,
  notifyError
}) => {
  const navigate = useNavigate()
  useEffect(() => {
    axios.post('http://localhost:8888/verify-token', {
      token: token
    }).then(() => {
      /* do nothing if successfully authenticated */
    }).catch(() => {
      notifyError('Authentication Failed')
      navigate('/login')
    })
  }, [])
  
  return children
}