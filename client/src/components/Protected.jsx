import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { notifyError } from 'utils/toast'
import axios from 'axios'

export const Protected = ({
  token,
  children
}) => {
  const navigate = useNavigate()
  useEffect(() => {
    axios.post('/verify-token', {
      token
    }).catch(() => {
      /* redirect to login page if user is not authenticated */
      notifyError('Authentication Failed')
      navigate('/login')
    })
  }, [])

  return children
}
