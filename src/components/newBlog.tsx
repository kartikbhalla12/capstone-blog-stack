import * as React from 'react'
import Auth from '../auth/Auth'
import {
  Container,
  Form,
  Button,
  Header,
  Message,
  Grid,
  Loader
} from 'semantic-ui-react'
import { Editor } from 'react-draft-wysiwyg'
import { convertToRaw, EditorState, RawDraftContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { createBlog } from '../api/blogs'

export interface NewBlogProps {
  auth: Auth
  history: any
}

export interface NewBlogState {
  editorState?: EditorState
  heading: string
  description: string
  authorName: string
  timeToRead: string
  imageFile?: File
  error: string
  success: string
  loading: boolean
}

class NewBlog extends React.Component<NewBlogProps, NewBlogState> {
  state: NewBlogState = {
    heading: '',
    description: '',
    authorName: '',
    timeToRead: '',
    error: '',
    success: '',
    loading: false
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
      editorState,
      imageFile
    } = this.state

    if (
      !authorName ||
      !description ||
      !heading ||
      !timeToRead ||
      !editorState ||
      !imageFile
    ) {
      this.setState({ ...this.state, error: 'All fields are required' })
    } else {
      this.setState({ ...this.state, loading: true })
      try {
        await createBlog(
          this.props.auth.getIdToken(),
          {
            authorName,
            description,
            heading,
            timeToRead,
            content: convertToRaw(editorState.getCurrentContent())
          },
          imageFile
        )
        await this.setState({
          heading: '',
          description: '',
          authorName: '',
          timeToRead: '',
          error: '',
          success: 'Created blog successfully!',
          editorState: undefined,
          imageFile: undefined
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
          Creating Blog!
        </Loader>
      </Grid.Row>
    )
  }

  render() {
    const { editorState } = this.state
    if (this.state.loading) return this.renderLoading()
    else
      return (
        <Container>
          <Header
            size="large"
            style={{ textAlign: 'center', margin: '2rem 0' }}
          >
            New Blog
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
                  Upload Image
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

export default NewBlog
