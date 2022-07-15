import React from 'react'
import "./Signup.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { notifyError, notifySuccess } from '../../utils/toast'
import Switch from 'react-switch'
import axios from 'axios'

const libraries = ['places']

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(null)
  const [privacyChecked, setPrivacyChecked] = useState(false)
  const navigate = useNavigate()

  /* set up Google Map Places autocomplete */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })

  if (!isLoaded) {
    return <h1>Loading</h1>
  }
  
  const handleOnSubmitSignup = async () => {
    try {
      const res = await axios.post('http://localhost:8888/signup',
      {
        username: username,
        password: password,
        location: place,
        privacy: privacyChecked
      })
      notifySuccess('Successfully created an account')
      navigate('/login')
    } catch (e) {
      notifyError(e.response.data.error.message)
    }
  }

  /* set up city/state autocomplete */
  const onLoad = (autocomplete) => {
    setAutocomplete(autocomplete)
  }

  const onPlaceChanged = () => {
    /* sets place state only if user chooses an autocorrect option */
    if (autocomplete !== null) {
      const placeObject = autocomplete.getPlace()
      if (Object.keys(placeObject).length <= 1) {
        setPlace(null)
        notifyError('Please enter a valid City/State')
      } else {
        setPlace(placeObject)
      }
    } else {
      setPlace(null)
      notifyError('Please enter a valid City/State')
    }
  }

  /* handle privacy switch */
  const handlePrivacySwitch = () => {
    setPrivacyChecked(!privacyChecked)
  }
  
  return (
    <div className="signup">
      <h1>Sign Up</h1>
      <input 
        type="text" 
        name='user' 
        placeholder='Enter username' 
        onChange={(e) => setUsername(e.target.value)} 
        value={username}
      />
      <input 
        type="text" 
        name='password' 
        placeholder='Enter password' 
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"

      />
      <Autocomplete 
        types={['locality']} 
        restrictions={{ country: ['us'] }}
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
      >
        <input type="text" placeholder='Enter your Location' onChange={() => {setPlace(null)}}/>
      </Autocomplete>
      <div className="switch">
        <span>Public</span>
        <Switch
          onChange={handlePrivacySwitch}
          checked={privacyChecked}
          className="react-switch"
          onColor="#86d3ff"
          onHandleColor="#2693e6"
          handleDiameter={30}
          uncheckedIcon={false}
          checkedIcon={false}
          boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
          activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
          height={20}
          width={48}
        />
        <span>Private</span>
      </div>
      <button onClick={handleOnSubmitSignup} disabled={place === null || username === '' || password === ''}>Sign Up</button>
    </div>
  )
}

export default Signup