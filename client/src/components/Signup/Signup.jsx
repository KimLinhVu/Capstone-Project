import React from 'react'
import "./Signup.css"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function Signup({
  setSignupMessage,
  signupMessage
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const navigate = useNavigate()

  /* clear messages on mount */
  useEffect(() => {
    setSignupMessage('')
  },[])
  
  const handleOnSubmitSignup = async () => {
    try {
      const res = await axios.post('http://localhost:3001/signup',
      {
        username: username,
        password: password
      })
      console.log(res)
      setSignupMessage('Success creating new account')
      navigate('/login')
    } catch (e) {
      setSignupMessage(e.response.data.error.message)
    }
  }
  
  return (
    <div className="signup">
        <h1>Sign Up</h1>
        <input type="text" name='user' placeholder='Enter username' onChange={(e) => setUsername(e.target.value)} value={username}/>
        <input type="text" name='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password}/>
        <button onClick={handleOnSubmitSignup}>Sign Up</button>
        {signupMessage !== '' ? <p>{signupMessage}</p> : null}
    </div>
  )
}

export default Signup