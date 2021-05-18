import * as React from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import {
  ContentState,
  EditorState,
  RawDraftContentBlock,
  RawDraftContentState
} from 'draft-js'
import { Container } from 'semantic-ui-react'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import Auth from './../auth/Auth'

export interface EditBlogProps {
  auth: Auth
}

export interface EditBlogState {
  contentState?: RawDraftContentState
}

class EditBlog extends React.Component<EditBlogProps, EditBlogState> {
  state: EditBlogState = {}

  onContentStateChange = (contentState: RawDraftContentState) => {
    this.setState({
      contentState
    })
    console.log(draftToHtml(contentState))
  }
  render() {
    const { contentState } = this.state
    return (
      <Container>
        <Editor
          initialContentState={contentState}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
          onContentStateChange={this.onContentStateChange}
        />
      </Container>
    )
  }
}

export default EditBlog
