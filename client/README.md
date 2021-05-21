# Blog Frontend

## Install

    npm install
   
## Run locally

    npm start

The `config.ts` file should be updated before runing the application. This file contains configuration for the api and the Auth0 authentication

```ts
export const apiEndpoint = `...`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Application Features

The Web Application supports following features
* Auth0 authentication
* View blogs from other users `/`
* View single blog with full content `/blogs/id`
* View own blogs `/my-blogs`
* View single own blog with full content `/my-blogs/id`
* Create new blog with support of full-fledged editor `/new-blog`
* Update own existing blog `/edit-blog`
* Delete own blog/s `/my-blogs` or `/my-blogs/id`
