import { useState } from "react"

function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token')
    const userToken = JSON.parse(tokenString)
    return userToken?.token
  }

  const [token, setToken] = useState(getToken())

  const saveToken = (userToken) => {
    localStorage.setItem('token', JSON.stringify(userToken))
    setToken(userToken.token)
  }

  const clearToken = () => {
    localStorage.removeItem('token')
    setToken(false)
  }

  return {
    setToken: saveToken,
    token: token,
    clearToken: clearToken
  }
}

export default useToken