import React from 'react'
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import Dashboard from '../Dashboard/Dashboard'
import { Protected } from '../Protected'
import useToken from './useToken'

function App() {
  const [signupMessage, setSignupMessage] = useState('')
  const {token, setToken, clearToken} = useToken()

  return (
    <div className='app'>
      <BrowserRouter>
        <main>
          <Routes>
            <Route path="/login" element=
              {
                <Login 
                  setToken={setToken}
                  signupMessage={signupMessage}
                  setSignupMessage={setSignupMessage}
                />
              }
            />
            <Route path="/" element=
              {
                <Protected token={token}>
                  <Dashboard clearToken={clearToken}/>
                </Protected>
              }
            />
            <Route path="/signup" element={<Signup />}/>
            <Route path="*" element={<h1>Page Not Found</h1>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App