import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { notifyError } from 'utils/toast'
import { logout } from 'utils/spotify'
import 'react-toastify/dist/ReactToastify.css'
import './Login.css'

function Login ({
  setToken,
  clearToken
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  useEffect(() => {
    logout()
    clearToken()
  }, [])

  const handleOnSubmitLogin = async (e) => {
    try {
      const { data } = await axios.post('http://localhost:8888/login',
        {
          username,
          password
        })
      setToken(data.accessToken)
      navigate('/')
    } catch (e) {
      notifyError(e.response.data.error.message)
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
      <button className='login-btn' onClick={handleOnSubmitLogin}>Log In</button>
      <Link to="/signup"><p className='register'>Register Now</p></Link>
      <ToastContainer
        position="top-center"
        limit={1}
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  )
}

export default Login
