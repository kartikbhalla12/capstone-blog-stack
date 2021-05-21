import * as React from 'react'
import Auth from '../auth/Auth'
import { Container } from 'semantic-ui-react'

interface LogInProps {
  auth: Auth
}

interface LogInState {}

export class LogIn extends React.PureComponent<LogInProps, LogInState> {
  onLogin = () => {
    this.props.auth.login()
  }

  render() {
    return (
      <Container
        style={{
          textAlign: 'center'
        }}
      >
        <h1>You need to login in order to continue</h1>
      </Container>
    )
  }
}
