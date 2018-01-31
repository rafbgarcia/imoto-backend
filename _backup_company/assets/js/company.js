const setCurrentCompany = (company) => {
  localStorage.company = JSON.stringify(company)
}

const getCurrentCompany = () => {
  if (localStorage.company) {
    return JSON.parse(localStorage.company)
  }
  return {}
}

const logout = () => {
  setCurrentCompany({})
}

const login = (company) => {
  setCurrentCompany(company)
}

const loggedIn = () => !!getCurrentCompany().token

export default {
  current: getCurrentCompany,
  loggedIn,
  login,
  logout,
  setCurrentCompany
}
