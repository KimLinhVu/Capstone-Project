import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { notifyError } from 'utils/toast'
import 'react-toastify/dist/ReactToastify.css'
import './Login.css'
import { login } from 'utils/users'

function Login ({
  setToken,
  clearToken
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [disabled, setDisabled] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    clearToken()
  }, [])

  useEffect(() => {
    username === '' || password === '' ? setDisabled(true) : setDisabled(false)
  }, [username, password])

  const handleOnSubmitLogin = async (e) => {
    try {
      const { data } = await login(username, password)
      setToken(data.accessToken)
      navigate('/')
    } catch (e) {
      notifyError(e.response.data.error.message)
    }
  }

  return (
    <div className="login">
      <div className="content">
        <h1>Spotifinder</h1>
        <label>
          <p>Username</p>
          <input type="text" name="user" onChange={(e) => setUsername(e.target.value)} value={username}/>
        </label>
        <label>
          <p>Password</p>
          <input type="password" name='password' onChange={(e) => setPassword(e.target.value)} value={password}/>
        </label>
        <button disabled={disabled} className={disabled ? 'login-btn disable' : 'login-btn'} onClick={handleOnSubmitLogin}>Login</button>
        <Link to="/signup"><p className='register'>Register Now</p></Link>
      </div>
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
