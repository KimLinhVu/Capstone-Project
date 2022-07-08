import React from 'react'
import "./Signup.css"
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import axios from 'axios'

const libraries = ['places']

function Signup({
  setSignupMessage,
  signupMessage
}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(null)
  const navigate = useNavigate()

  /* set up Google Map Places autocomplete */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })

  /* clear messages on mount */
  useEffect(() => {
    setSignupMessage('')
  },[])

  if (!isLoaded) {
    return <h1>Loading</h1>
  }
  
  const handleOnSubmitSignup = async () => {
    try {
      const res = await axios.post('http://localhost:8888/signup',
      {
        username: username,
        password: password,
        location: place
      })
      console.log(res)
      setSignupMessage('Success creating new account')
      navigate('/login')
    } catch (e) {
      setSignupMessage(e.response.data.error.message)
    }
  }

  /* set up city/state autocomplete */
  const onLoad = (autocomplete) => {
    console.log(autocomplete)
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    /* sets place state only if user chooses an autocorrect option */
    if (autocomplete !== null) {
      const placeObject = autocomplete.getPlace()
      if (Object.keys(placeObject).length <= 1) {
        setPlace(null)
        setSignupMessage('Please enter a valid City/State')
      } else {
        setPlace(placeObject)
      }
    } else {
      setPlace(null)
      setSignupMessage('Please enter a valid City/State')
    }
  }
  
  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <input type="text" name='user' placeholder='Enter username' onChange={(e) => setUsername(e.target.value)} value={username}/>
      <input type="text" name='password' placeholder='Enter password' onChange={(e) => setPassword(e.target.value)} value={password}/>
      <Autocomplete 
        types={['locality']} 
        restrictions={{ country: ['us'] }}
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input type="text" placeholder='Enter your Location (City/State)' onChange={() => {setPlace(null)}}/>
      </Autocomplete>
      <button onClick={handleOnSubmitSignup} disabled={place === null || username === '' || password === ''}>Sign Up</button>
      {signupMessage !== '' ? <p>{signupMessage}</p> : null}
    </div>
  )
}

export default Signup