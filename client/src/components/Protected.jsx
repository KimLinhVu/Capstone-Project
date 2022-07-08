import React from 'react'
import { Navigate } from 'react-router-dom'

export const Protected = ({token, children}) => {
  if (!token) {
    return <Navigate to="/login" />
  }
  return children
}