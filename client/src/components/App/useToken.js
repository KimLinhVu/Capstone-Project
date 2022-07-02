import { useState } from "react"

function useToken() {
  const getToken = () => {
    const tokenString = sessionStorage.getItem('token')
    const userToken = JSON.parse(tokenString)
    return userToken?.token
  }

  const [token, setToken] = useState(getToken())

  const saveToken = (userToken) => {
    sessionStorage.setItem('token', JSON.stringify(userToken))
    setToken(userToken.token)
  }

  const clearToken = () => {
    sessionStorage.clear()
    setToken(false)
  }

  return {
    setToken: saveToken,
    token: token,
    clearToken: clearToken
  }
}

export default useToken