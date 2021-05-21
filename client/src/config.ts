// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
export const apiEndpoint = `https://blog-api.kartikbhalla.dev`
// export const apiEndpoint = `localhost:3000/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-gg9z0y7i.us.auth0.com', // Auth0 domain
  clientId: 'm2QIn0r3RzS9JyfJeNwW4aP8M2SrVY1a', // Auth0 client id
  callbackUrl: `${window.location.origin}/callback`
}
