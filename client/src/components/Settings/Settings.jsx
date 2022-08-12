import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { notifyError, notifySuccess } from 'utils/toast'
import { ToastContainer } from 'react-toastify'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import ReactLoading from 'react-loading'
import './Settings.css'
import { updateUserSettings } from 'utils/users'

const libraries = ['places']

function Settings () {
  const navigate = useNavigate()
  const location = useLocation()
  const { profile } = location.state
  const [username, setUsername] = useState(profile.username)
  const [privacy, setPrivacy] = useState(profile.isPrivate)
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(profile.location)
  const [disable, setDisable] = useState(false)
  const [followingChecked, setFollowingChecked] = useState(profile.showFollowing)
  let privacySwitch
  let followingCheckBox

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  useEffect(() => {
    /* do not allow user to update settings if no settings were changed */
    if (username.trim() === profile.username.trim() && profile.location.formatted_address === place?.formatted_address && privacy === profile.isPrivate && followingChecked === profile.showFollowing) {
      setDisable(true)
    } else {
      setDisable(false)
    }
  }, [username, place, privacy, followingChecked])

  if (!isLoaded) {
    return <ReactLoading color='#B1A8A6' type='spin' className='loading'/>
  }

  if (privacy) {
    privacySwitch = <Switch defaultChecked onChange={(e) => setPrivacy(e.target.checked)}/>
  } else {
    privacySwitch = <Switch onChange={(e) => setPrivacy(e.target.checked)}/>
  }

  if (profile.showFollowing) {
    followingCheckBox = <FormControlLabel control={<Checkbox defaultChecked onChange={(e) => setFollowingChecked(e.target.checked)}/>} label="Only users I am following can view my profile"/>
  } else {
    followingCheckBox = <FormControlLabel control={<Checkbox onChange={(e) => setFollowingChecked(e.target.checked)}/>} label="Only users I am following can view my profile"/>
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
      setDisable(true)
      await updateUserSettings(username.trim(), place, privacy, followingChecked)
      notifySuccess('Successfully updated settings. Redirecting...')
      setTimeout(() => navigate('/'), 2000)
    } catch (e) {
      notifyError(e.response.data.error.message)
    }
  }

  return (
    <div className="setting">
      <div className="content">
        <h1>Settings</h1>
        <div className="username">
          <label>
            <p>Username</p>
            <input
            type="text"
            name='user'
            placeholder='Change username'
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
          </label>
        </div>
        <div className="location">
          <p>Location </p>
          <Autocomplete
            types={['locality']}
            restrictions={{ country: ['us'] }}
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
          >
            <input type="text" placeholder={profile.location.formatted_address} value={place?.formatted_address} onChange={() => { setPlace(null) }}/>
          </Autocomplete>
        </div>
        <FormControlLabel control={privacySwitch} label="Private Account" />
        {privacy
          ? (
          <div className="followers">
            {followingCheckBox}
          </div>
            )
          : null}
        <button disabled={place === null || username === '' || disable} className={place === null || username === '' || disable ? 'disable' : 'update-btn'} onClick={handleUpdateSettings}>Update Settings</button>
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

export default Settings
