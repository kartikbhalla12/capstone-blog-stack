import * as React from 'react'
import { Item, Button } from 'semantic-ui-react'
import { BlogListView } from './../../types/Blog'
import { useHistory } from 'react-router'

export interface BlogItemProps {
  blog: BlogListView
  myBlog?: boolean
  deleteBlog?: (blogId: string) => void
}

const BlogItem: React.FC<BlogItemProps> = ({ blog, deleteBlog, myBlog }) => {
  const history = useHistory()
  return (
    <Item
      onClick={() => {
        if (myBlog) history.push(`/my-blogs/${blog.blogId}`)
        else history.push(`/blogs/${blog.blogId}`)
      }}
      style={{ cursor: 'pointer' }}
    >
      <Item.Image
        size="small"
        src={blog.imageUrl}
        rounded
        className="blog-image"
      />
      <Item.Content verticalAlign="middle">
        <Item.Header
          as="a"
          style={{ lineHeight: '2.5rem', fontSize: '1.8rem' }}
        >
          {blog.heading}
        </Item.Header>
        <Item.Meta style={{ lineHeight: '1.8rem', fontSize: '1.2rem' }}>
          {blog.description}
        </Item.Meta>
        <Item.Extra style={{ display: 'flex' }}>
          <div>By {blog.authorName}</div>
          <div> • </div>
          <div>{blog.timeToRead}</div>
        </Item.Extra>
        <Item.Extra style={{ display: 'flex' }}>
          {myBlog && (
            <div>
              <Button
                floated="left"
                onClick={(event) => {
                  event.stopPropagation()
                  history.push(`/my-blogs/edit/${blog.blogId}`)
                }}
              >
                EDIT BLOG
              </Button>

              <Button
                floated="left"
                color="red"
                onClick={(event) => {
                  event.stopPropagation()
                  deleteBlog && deleteBlog(blog.blogId)
                }}
              >
                DELETE BLOG
              </Button>
            </div>
          )}
        </Item.Extra>
      </Item.Content>
    </Item>
  )
}

export default BlogItem
