import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import "./Login.css"

function Login({
  setToken,
  clearToken,
  signupMessage,
  setSignupMessage
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  
  const navigate = useNavigate()

  useEffect(() => {
    clearToken()
  }, [])

  const handleOnSubmitLogin = async (e) => {
    try {
      const { data, userId } = await axios.post('http://localhost:8888/login',
      {
        username: username,
        password: password
      })
      setToken(data.accessToken)
      navigate('/')
    } catch (e) {
      setSignupMessage('')
      setLoginMessage(e.response.data.error.message)
    }
  }

  return (
    <div className="login">
      <h1>Login</h1>
      <label>
        <p>Username</p>
        <input type="text" name="user" placeholder='Enter username' onChange={(e) => setUsername(e.target.value)} value={username}/>
      </label>
      <label>
        <p>Password</p>
        <input type="password" name='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password}/>
      </label>
      <button type="submit" className='login' onClick={handleOnSubmitLogin}>Log In</button>
      <Link to="/signup"><p className='register'>Register Now</p></Link>
      {signupMessage !== '' ? <p>{signupMessage}</p> : null}
      {loginMessage !== '' ? <p>{loginMessage}</p> : null}
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
}

export default Login