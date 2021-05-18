import * as React from 'react'
import { deleteMyBlog, getMyBlogs } from '../api/blogs'
import Auth from '../auth/Auth'
import { BlogListView } from './../types/Blog'
import { Header, Container, Grid, Loader, Item } from 'semantic-ui-react'
import BlogItem from './common/BlogItem'
import { History } from 'history'

export interface MyBlogsProps {
  auth: Auth
  history: History
}

export interface MyBlogsState {
  blogs: BlogListView[]
  loadingBlogs: boolean
}

class MyBlogs extends React.Component<MyBlogsProps, MyBlogsState> {
  state: MyBlogsState = { blogs: [], loadingBlogs: true }

  async componentDidMount() {
    try {
      const blogs = await getMyBlogs(this.props.auth.getIdToken())
      this.setState({
        blogs,
        loadingBlogs: false
      })
    } catch (e) {
      alert(`Failed to fetch my blogs: ${e.message}`)
    }
  }

  async handleDeleteBlog(blogId: string) {
    await deleteMyBlog(this.props.auth.getIdToken(), blogId)
    this.setState({
      blogs: this.state.blogs.filter((blog) => blog.blogId !== blogId)
    })
  }

  render() {
    return (
      <Container>
        <Header as="h1">My Blogs</Header>

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
          <BlogItem
            blog={blog}
            key={key}
            myBlog
            deleteBlog={(blogId: string) => this.handleDeleteBlog(blogId)}
          />
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

export default MyBlogs
