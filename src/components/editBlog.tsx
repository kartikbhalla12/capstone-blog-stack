import * as React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorState
} from 'draft-js'
import {
  Container,
  Form,
  Button,
  Header,
  Message,
  Grid,
  Loader
} from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { RouteComponentProps } from 'react-router-dom'
import { getMyBlog, updateBlog } from '../api/blogs'

export interface EditBlogProps extends RouteComponentProps<{ blogId: string }> {
  auth: Auth
}
export interface EditBlogState {
  editorState?: EditorState
  heading: string
  description: string
  authorName: string
  timeToRead: string
  imageFile?: File
  error: string
  success: string
  loadingBlog: boolean
  loadingMessage: string
}

class EditBlog extends React.Component<EditBlogProps, EditBlogState> {
  state: EditBlogState = {
    heading: '',
    description: '',
    authorName: '',
    timeToRead: '',
    error: '',
    success: '',
    loadingBlog: true,
    loadingMessage: 'Loading Blog!'
  }

  componentDidMount = async () => {
    const {
      match: { params }
    } = this.props

    try {
      const blog = await getMyBlog(this.props.auth.getIdToken(), params.blogId)

      const contentState = convertFromRaw(blog.content)
      const editorState = EditorState.createWithContent(contentState)

      this.setState({
        heading: blog.heading,
        authorName: blog.authorName,
        description: blog.description,
        timeToRead: blog.timeToRead,
        editorState,
        loadingBlog: false
      })
    } catch (e) {
      alert(`Failed to fetch blog: ${e.message}`)
    }
  }

  handleInputChange = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.FormEvent<HTMLTextAreaElement>
  ) =>
    this.setState({
      ...this.state,
      [event.currentTarget.name]: event.currentTarget.value
    })

  handleFileChange = (image: File) =>
    this.setState({ ...this.state, imageFile: image })

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState
    })
  }

  handleSubmit = async () => {
    const {
      authorName,
      description,
      heading,
      timeToRead,
      editorState
      // imageFile
    } = this.state

    if (
      !authorName ||
      !description ||
      !heading ||
      !timeToRead ||
      !editorState
      // !imageFile
    ) {
      this.setState({ ...this.state, error: 'All fields are required' })
    } else {
      try {
        this.setState({
          loadingBlog: true,
          loadingMessage: 'Updating Blog!'
        })
        await updateBlog(
          this.props.auth.getIdToken(),
          this.props.match.params.blogId,
          {
            authorName,
            description,
            heading,
            timeToRead,
            content: convertToRaw(editorState.getCurrentContent())
          }
        )
        await this.setState({
          error: '',
          success: 'Updated blog successfully!',
          editorState: undefined,
          loadingBlog: false,
          loadingMessage: ''
        })
        this.props.history.push('/my-blogs')
      } catch (ex) {
        this.setState({
          error: 'Network Error!',
          success: ''
        })
      }
    }
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          {this.state.loadingMessage}
        </Loader>
      </Grid.Row>
    )
  }

  render() {
    const { editorState } = this.state
    if (this.state.loadingBlog) return this.renderLoading()
    else
      return (
        <Container>
          <Header
            size="large"
            style={{ textAlign: 'center', margin: '2rem 0' }}
          >
            Edit Blog
          </Header>
          <Form size="large" warning>
            <Form.Field required>
              <label>Heading</label>
              <input
                name="heading"
                value={this.state.heading}
                onChange={this.handleInputChange}
                placeholder=""
              />
            </Form.Field>
            <Form.TextArea
              required
              label="Short Description"
              name="description"
              placeholder=""
              value={this.state.description}
              onChange={this.handleInputChange}
            />
            <Form.Field required>
              <label>Author Name</label>
              <input
                value={this.state.authorName}
                name="authorName"
                placeholder=""
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field required>
              <label>Time To Read</label>
              <input
                value={this.state.timeToRead}
                name="timeToRead"
                placeholder=""
                onChange={this.handleInputChange}
              />
            </Form.Field>
            <Form.Field>
              <label>Image</label>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Button
                  as="label"
                  style={{ width: 'fit-content' }}
                  htmlFor="file"
                  type="button"
                >
                  Change Image
                </Button>
                <p>{this.state.imageFile?.name}</p>
              </div>

              <input
                type="file"
                id="file"
                style={{ display: 'none' }}
                onChange={({ currentTarget }) =>
                  this.handleFileChange(currentTarget.files![0])
                }
              />
            </Form.Field>
            <Form.Field required>
              <label>Write Blog</label>
              <Editor
                editorState={editorState}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                onEditorStateChange={this.onEditorStateChange}
                editorStyle={{
                  border: '1px solid #F1F1F1',
                  minHeight: '10rem',
                  padding: '0 1rem'
                }}
              />
            </Form.Field>
            <Message
              warning
              header={this.state.error ? 'Error' : 'Success'}
              error={!!this.state.error}
              success={!!this.state.success}
              hidden={!this.state.error && !this.state.success}
              list={[this.state.error ? this.state.error : this.state.success]}
            />
            <Form.Button type="submit" onClick={this.handleSubmit}>
              Submit
            </Form.Button>
          </Form>
        </Container>
      )
  }
}

export default EditBlog
