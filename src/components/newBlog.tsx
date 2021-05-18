import * as React from 'react'
import Auth from './../auth/Auth'
import { Container, Form, Button, Header, Message } from 'semantic-ui-react'
import { Editor } from 'react-draft-wysiwyg'
import { ContentState, RawDraftContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import { createBlog } from '../api/blogs'

export interface NewBlogProps {
  auth: Auth
  history: any
}

export interface NewBlogState {
  contentState?: RawDraftContentState
  heading: string
  description: string
  authorName: string
  timeToRead: string
  imageFile?: File
  error: string
  success: string
}

class NewBlog extends React.Component<NewBlogProps, NewBlogState> {
  state: NewBlogState = {
    heading: '',
    description: '',
    authorName: '',
    timeToRead: '',
    error: '',
    success: ''
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

  onContentStateChange = (contentState: RawDraftContentState) => {
    this.setState({
      contentState
    })
    // console.log(draftToHtml(contentState))
  }

  handleSubmit = async () => {
    const {
      authorName,
      description,
      heading,
      timeToRead,
      contentState,
      imageFile
    } = this.state

    if (
      !authorName ||
      !description ||
      !heading ||
      !timeToRead ||
      !contentState ||
      !imageFile
    ) {
      this.setState({ ...this.state, error: 'All fields are required' })
    } else {
      console.log(this.state)
      console.log(contentState && draftToHtml(contentState))

      try {
        await createBlog(
          this.props.auth.getIdToken(),
          {
            authorName,
            description,
            heading,
            timeToRead,
            content: draftToHtml(contentState)
          },
          imageFile
        )
        this.setState({
          heading: '',
          description: '',
          authorName: '',
          timeToRead: '',
          error: '',
          success: 'Created blog successfully!',
          contentState: undefined
        })
      } catch (ex) {
        this.setState({
          error: 'Network Error!',
          success: ''
        })
      }
    }
  }

  render() {
    const { contentState } = this.state
    return (
      <Container>
        <Header size="large" style={{ textAlign: 'center', margin: '2rem 0' }}>
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
              initialContentState={contentState}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onContentStateChange={this.onContentStateChange}
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
