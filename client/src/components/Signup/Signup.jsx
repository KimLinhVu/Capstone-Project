import React from 'react'
import "./Signup.css"
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { notifyError, notifySuccess } from 'utils/toast'
import { ToastContainer } from 'react-toastify'
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import axios from 'axios'

const libraries = ['places']

function Signup() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(null)
  const [privacy, setPrivacy] = useState(false)
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
      await axios.post('http://localhost:8888/signup',
      {
        username: username,
        password: password,
        location: place,
        privacy: privacy
      })
      notifySuccess('Successfully created an account. Redirecting...')
      setTimeout(() => navigate('/login'), 2000)
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
  
  return (
    <div className="signup">
      <div className="content">
        <h1>Sign Up</h1>
        <label>
          <p>Username</p>
          <input 
            type="text" 
            name='user' 
            onChange={(e) => setUsername(e.target.value)} 
            value={username}
          />
        </label>
        <label>
          <p>Password</p>
          <input 
            type="text" 
            name='password' 
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />
        </label>
        <Autocomplete 
          types={['locality']} 
          restrictions={{ country: ['us'] }}
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <input type="text" placeholder='Enter your Location' onChange={() => {setPlace(null)}}/>
        </Autocomplete>
        <div className="switch">
          <FormControlLabel control={<Switch onChange={(e) => setPrivacy(e.target.checked)}/>} label="Private Account" />
        </div>
        <button onClick={handleOnSubmitSignup} disabled={place === null || username === '' || password === ''} className='signup-btn'>Sign Up</button>
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

export default Signup