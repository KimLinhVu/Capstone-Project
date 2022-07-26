import { useState } from 'react'

function useToken () {
  const getToken = () => {
    const token = localStorage.getItem('token')
    return token
  }

  const [token, setToken] = useState(getToken())

  const saveToken = (userToken) => {
    localStorage.setItem('token', userToken)
    setToken(userToken)
  }

  const clearToken = () => {
    localStorage.removeItem('token')
    setToken(false)
  }

  return {
    setToken: saveToken,
    token,
    clearToken
  }
}

export default useToken
