import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from 'components/Login/Login'
import Signup from 'components/Signup/Signup'
import Dashboard from 'components/Dashboard/Dashboard'
import { Protected } from 'components/Protected'
import PlaylistDetail from 'components/PlaylistDetail/PlaylistDetail'
import useToken from 'utils/useToken'
import RecommendView from 'components/RecommendView/RecommendView'
import UserPlaylistDetail from 'components/UserPlaylistDetail/UserPlaylistDetail'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {
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
                  clearToken={clearToken}
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
            <Route path="/signup" element=
              {
                <Signup />
              }
            />
            <Route path="/playlist/:playlistId" element=
              {
                <Protected token={token}>
                  <PlaylistDetail />
                </Protected>
              }
            />
            <Route path="/recommend/:playlistId" element=
              {
                <Protected token={token}>
                  <RecommendView />
                </Protected>
              }
            />
            <Route path="recommend/playlist/:playlistId/:originalPlaylistId" element=
              {
                <Protected token={token}>
                  <UserPlaylistDetail />
                </Protected>
              }
            />
            <Route path="*" element={<h1>Page Not Found</h1>}/>
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  )
}

export default App