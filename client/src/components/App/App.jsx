import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../Login/Login'
import Signup from '../Signup/Signup'
import Dashboard from '../Dashboard/Dashboard'
import { Protected } from '../Protected'
import PlaylistDetail from '../PlaylistDetail/PlaylistDetail'
import useToken from '../../utils/useToken'
import RecommendView from '../RecommendView/RecommendView'
import UserPlaylistDetail from '../UserPlaylistDetail/UserPlaylistDetail'
import 'react-toastify/dist/ReactToastify.css';

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