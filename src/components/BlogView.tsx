import * as React from 'react'
import Auth from '../auth/Auth'
import { History } from 'history'
import { Blog } from '../types/Blog'
import { deleteMyBlog, getBlog, getMyBlog } from '../api/blogs'
import { RouteComponentProps } from 'react-router-dom'
import {
  Header,
  Container,
  Grid,
  Loader,
  Button,
  Image
} from 'semantic-ui-react'
import ReactHtmlParser from 'react-html-parser'

export interface BlogViewProps extends RouteComponentProps<{ blogId: string }> {
  auth: Auth
  userBlog?: boolean
}

export interface BlogViewState {
  blog?: Blog
  loadingBlog: boolean
}

class BlogView extends React.Component<BlogViewProps, BlogViewState> {
  state: BlogViewState = { loadingBlog: true }

  async componentDidMount() {
    const {
      match: { params }
    } = this.props

    let blog: Blog
    try {
      if (this.props.userBlog)
        blog = await getMyBlog(this.props.auth.getIdToken(), params.blogId)
      else blog = await getBlog(this.props.auth.getIdToken(), params.blogId)

      this.setState({
        blog,
        loadingBlog: false
      })
    } catch (e) {
      alert(`Failed to fetch blog: ${e.message}`)
    }
  }

  render() {
    return <Container> {this.renderBlog()}</Container>
  }

  async handleDeleteBlog(blogId: string) {
    try {
      await deleteMyBlog(this.props.auth.getIdToken(), blogId)
      this.props.history.push('/my-blogs')
    } catch (ex) {
      alert(ex)
    }
  }

  renderBlog() {
    if (this.state.loadingBlog) {
      return this.renderLoading()
    }
    const { blog } = this.state
    const updatedAt = new Date(blog!.updatedAt).toLocaleString(undefined, {
      timeStyle: 'short',
      dateStyle: 'full'
    })
    // const updatedTime = `${updatedAt.getHours()} : ${updatedAt.getMinutes()}`

    return (
      <Container style={{ marginTop: '4rem' }}>
        <Header size="huge">{blog?.heading}</Header>
        <Header
          size="medium"
          style={{ fontWeight: 500, marginTop: 0, marginBottom: '0.5rem' }}
        >
          {blog?.description}
        </Header>
        <div style={{ display: 'flex', flexWrap: 'wrap', margin: '1rem 0' }}>
          <span>By {blog?.authorName}</span>
          <span style={{ padding: '0 0.5rem' }}>•</span>
          <span>{blog?.timeToRead} read</span>
          <span style={{ padding: '0 0.5rem' }}>•</span>
          <span>Updated {updatedAt}</span>
        </div>

        {this.props.userBlog && (
          <div style={{ margin: '1rem 0' }}>
            <Button
              onClick={(event) => {
                event.stopPropagation()
                this.props.history.push(`/my-blogs/edit/${blog!.blogId}`)
              }}
            >
              EDIT BLOG
            </Button>

            <Button
              color="red"
              onClick={async (event) => {
                event.stopPropagation()
                await this.handleDeleteBlog(blog!.blogId)
              }}
            >
              DELETE BLOG
            </Button>
          </div>
        )}

        <Image
          src={blog?.imageUrl}
          size="large"
          fluid
          centered
          className="blog-view-image"
          style={{
            width: '100% ',
            objectFit: 'cover',
            height: '40rem',
            marginBottom: '2rem'
          }}
        />

        <>{ReactHtmlParser(blog!.content)}</>
      </Container>
    )
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Blog
        </Loader>
      </Grid.Row>
    )
  }
}

export default BlogView
