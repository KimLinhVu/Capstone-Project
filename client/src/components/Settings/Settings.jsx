import React from 'react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { notifyError, notifySuccess } from 'utils/toast'
import { ToastContainer } from 'react-toastify'
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import './Settings.css'
import { updateUserSettings } from 'utils/users'

const libraries = ['places']

function Settings() {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = location.state
  const [username, setUsername] = useState(profile.username)
  const [privacy, setPrivacy] = useState(profile.privacy)
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(profile.location)
  let privacySwitch

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries
  })

  if (!isLoaded) {
    return <h1>Loading</h1>
  }

  if (privacy) {
    privacySwitch = <Switch defaultChecked onChange={(e) => setPrivacy(e.target.checked)}/>
  } else {
    privacySwitch = <Switch onChange={(e) => setPrivacy(e.target.checked)}/>
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

  const handleUpdateSettings = async () => {
    try {
      await updateUserSettings(username, place, privacy)
      notifySuccess('Successfully updated settings. Redirecting...')
      setTimeout(() => navigate('/'), 2000)
    } catch (e) {
      notifyError(e.response.data.error.message)
    }
  }

  return (
    <div className="settings">
      <h2>{profile.username} Settings</h2>
      <div className="username">
        <span>Change Username</span>
        <input 
          type="text" 
          name='user' 
          placeholder='Enter username' 
          onChange={(e) => setUsername(e.target.value)} 
          value={username}
        />
      </div>
      <div className="location">
        <p>Change Address: </p>
        <Autocomplete 
          types={['locality']} 
          restrictions={{ country: ['us'] }}
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
        >
          <input type="text" placeholder={profile.location.formatted_address} onChange={() => {setPlace(null)}}/>
        </Autocomplete>
      </div>
      <FormControlLabel control={privacySwitch} label="Private Account" />
      <button disabled={place === null || username === ''} className='signup-btn' onClick={handleUpdateSettings}>Update Settings</button>
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

export default Settings