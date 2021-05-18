import * as React from 'react'
import { getBlogs } from '../api/blogs'
import Auth from '../auth/Auth'
import { History } from 'history'
import { Header, Container, Grid, Loader, Item } from 'semantic-ui-react'
import { BlogListView } from './../types/Blog'
import BlogItem from './common/BlogItem'

export interface BlogsProps {
  auth: Auth
  history: History
}

export interface BlogsState {
  blogs: BlogListView[]
  loadingBlogs: boolean
}

class Blogs extends React.Component<BlogsProps, BlogsState> {
  state = { blogs: [], loadingBlogs: true }

  async componentDidMount() {
    try {
      const blogs = await getBlogs(this.props.auth.getIdToken())
      this.setState({
        blogs,
        loadingBlogs: false
      })
    } catch (e) {
      alert(`Failed to fetch blogs: ${e.message}`)
    }
  }

  render() {
    return (
      <Container>
        <Header as="h1">Blogs</Header>

        {/* {this.renderCreateTodoInput()} */}

        {this.renderBlogs()}
      </Container>
    )
  }

  renderBlogs() {
    if (this.state.loadingBlogs) {
      return this.renderLoading()
    }

    return (
      <Item.Group>
        {this.state.blogs.map((blog, key) => (
          <BlogItem blog={blog} key={key} />
        ))}
      </Item.Group>
    )
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Blogs
        </Loader>
      </Grid.Row>
    )
  }
}

export default Blogs
