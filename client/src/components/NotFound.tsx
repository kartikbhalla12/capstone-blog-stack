import * as React from 'react'
import { Container } from 'semantic-ui-react'

interface NotFoundProps {}

interface NotFoundState {}

export class NotFound extends React.PureComponent<
  NotFoundProps,
  NotFoundState
> {
  render() {
    return (
      <Container>
        <h1 style={{ textAlign: 'center' }}>Not Found</h1>
      </Container>
    )
  }
}
