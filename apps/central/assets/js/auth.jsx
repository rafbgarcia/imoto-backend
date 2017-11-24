import React from 'react'

const Auth = () => {}

Auth.loggedIn = false
Auth.login = (cb) => {

  localStorage.setItem('authToken', token)
}

export default Auth
