const setCurrentCentral = (central) => {
  localStorage.central = JSON.stringify(central)
}

const getCurrentCentral = () => {
  if (localStorage.central) {
    return JSON.parse(localStorage.central)
  }
  return {}
}

const logout = () => {
  setCurrentCentral({})
}

const login = (central) => {
  setCurrentCentral(central)
}

const loggedIn = () => !!getCurrentCentral().token

export default {
  current: getCurrentCentral,
  loggedIn,
  login,
  logout,
  setCurrentCentral
}
