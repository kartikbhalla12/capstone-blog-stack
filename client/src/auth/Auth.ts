import auth0 from 'auth0-js'
import { authConfig } from '../config'

export default class Auth {
  accessToken: any
  idToken: any
  expiresAt: any
  history: any

  auth0 = new auth0.WebAuth({
    domain: authConfig.domain,
    clientID: authConfig.clientId,
    redirectUri: authConfig.callbackUrl,
    responseType: 'token id_token',
    scope: 'openid'
  })

  constructor(history: any) {
    this.history = history

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
    this.handleAuthentication = this.handleAuthentication.bind(this)
    this.isAuthenticated = this.isAuthenticated.bind(this)
    this.getAccessToken = this.getAccessToken.bind(this)
    this.getIdToken = this.getIdToken.bind(this)
    this.renewSession = this.renewSession.bind(this)
    this.idToken = localStorage.getItem('idToken')
  }

  login() {
    this.auth0.authorize()
  }

  handleAuthentication() {
    this.auth0.parseHash((err: any, authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Access token: ', authResult.accessToken)
        console.log('id token: ', authResult.idToken)
        this.setSession(authResult)
      } else if (err) {
        this.history.replace('/')
        console.log(err)
        alert(`Error: ${err.error}. Check the console for further details.`)
      }
    })
  }

  getAccessToken() {
    return this.accessToken
  }

  getIdToken() {
    // return this.idToken;
    return localStorage.getItem('idToken') as string
  }

  setSession(authResult: any) {
    // Set isLoggedIn flag in localStorage
    let expiresAt = authResult.expiresIn * 1000 + new Date().getTime()

    localStorage.setItem('isLoggedIn', 'true')
    localStorage.setItem('idToken', authResult.idToken)
    localStorage.setItem('expiresAt', expiresAt.toString())

    // Set the time that the access token will expire at
    this.accessToken = authResult.accessToken
    this.idToken = authResult.idToken
    this.expiresAt = expiresAt

    // navigate to the home route
    this.history.replace('/')
  }

  renewSession() {
    this.auth0.checkSession({}, (err: any, authResult: any) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult)
      } else if (err) {
        this.logout()
        console.log(err)
        alert(
          `Could not get a new token (${err.error}: ${err.error_description}).`
        )
      }
    })
  }

  logout() {
    // Remove tokens and expiry time
    this.accessToken = null
    this.idToken = null
    this.expiresAt = 0

    // Remove isLoggedIn flag from localStorage
    localStorage.removeItem('isLoggedIn')

    localStorage.removeItem('idToken')
    localStorage.removeItem('expiresAt')

    this.auth0.logout({
      returnTo: window.location.origin
    })

    // navigate to the home route
    this.history.replace('/')
  }

  isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    let expiresAt = Number(localStorage.getItem('expiresAt'))
    return new Date().getTime() < expiresAt
  }
}
