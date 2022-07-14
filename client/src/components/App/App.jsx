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
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const {token, setToken, clearToken} = useToken()

  const notifySuccess = (successMessage) => {
    toast.success(successMessage, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

  const notifyError = (errorMessage) => {
    toast.error(errorMessage, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  }

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
                  notifyError={notifyError}
                />
              }
            />
            <Route path="/" element=
              {
                <Protected notifyError={notifyError} token={token}>
                  <Dashboard clearToken={clearToken}/>
                </Protected>
              }
            />
            <Route path="/signup" element=
              {
                <Signup 
                  notifyError={notifyError}
                  notifySuccess={notifySuccess}
                />
              }
            />
            <Route path="/playlist/:playlistId" element=
              {
                <Protected notifyError={notifyError} token={token}>
                  <PlaylistDetail
                    notifyError={notifyError}
                    notifySuccess={notifySuccess}
                  />
                </Protected>
              }
            />
            <Route path="/recommend/:playlistId" element=
              {
                <Protected notifyError={notifyError} token={token}>
                  <RecommendView />
                </Protected>
              }
            />
            <Route path="recommend/playlist/:playlistId/:originalPlaylistId" element=
              {
                <Protected notifyError={notifyError} token={token}>
                  <UserPlaylistDetail 
                    notifyError={notifyError}
                    notifySuccess={notifySuccess}
                  />
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