import React from 'react'
import { Navigate } from 'react-router-dom'
import { logout } from '../spotify'

export const Protected = ({token, children}) => {
  if (!token) {
    logout()
    return <Navigate to="/login" />
  }
  return children
}