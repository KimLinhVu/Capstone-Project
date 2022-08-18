import React, { useState, useEffect } from 'react'
import './Signup.css'
import { useNavigate } from 'react-router-dom'
import { useJsApiLoader, Autocomplete } from '@react-google-maps/api'
import { notifyError, notifySuccess } from 'utils/toast'
import { ToastContainer } from 'react-toastify'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import ReactLoading from 'react-loading'
import { signup } from 'utils/users'

const libraries = ['places']

function Signup () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [autocomplete, setAutocomplete] = useState(null)
  const [place, setPlace] = useState(null)
  const [followingChecked, setFollowingChecked] = useState(false)
  const [privacy, setPrivacy] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const navigate = useNavigate()

  /* set up Google Map Places autocomplete */
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries
  })

  useEffect(() => {
    username === '' || password === '' || place === null ? setDisabled(true) : setDisabled(false)
  }, [username, password, place])

  if (!isLoaded) {
    return <ReactLoading color='#B1A8A6' type='spin' className='signup-loading'/>
  }

  const handleOnSubmitSignup = async () => {
    try {
      if (password !== confirmPassword) {
        notifyError('Passwords do not match.')
        return
      }
      setDisabled(true)
      await signup(username, password, place, privacy, followingChecked)
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
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />
        </label>
        <label>
          <p>Confirm Password</p>
          <input
            type="password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
          />
        </label>
        <label>
          <p>Location</p>
          <Autocomplete
          types={['locality']}
          restrictions={{ country: ['us'] }}
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          >
            <input type="text" onChange={() => { setPlace(null) }}/>
          </Autocomplete>
        </label>
        <div className="switch">
          <FormControlLabel control={<Switch onChange={(e) => setPrivacy(e.target.checked)}/>} label="Private Account" />
        </div>
        {privacy
          ? (
          <div className="followers">
            <FormControlLabel control={<Checkbox onChange={(e) => setFollowingChecked(e.target.checked)}/>} label="Only users I am following can view my profile"/>
          </div>
            )
          : null}
        <button onClick={handleOnSubmitSignup} disabled={disabled} className={disabled ? 'signup-btn disable' : 'signup-btn'}>Sign Up</button>
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
