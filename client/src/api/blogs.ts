import Axios from 'axios'
import { apiEndpoint } from '../config'
import { Blog, BlogListView } from './../types/Blog'
import { BlogRequest } from './../types/BlogRequest'

export async function getBlogs(idToken: string): Promise<BlogListView[]> {
  console.log('Fetching blogs')

  const response = await Axios.get(`${apiEndpoint}/blogs`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Blogs:', response.data)
  return response.data.items
}

export async function getMyBlogs(idToken: string): Promise<BlogListView[]> {
  console.log('Fetching my blogs')

  const response = await Axios.get(`${apiEndpoint}/blogs?self=true`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('My Blogs:', response.data)
  return response.data.items
}

export async function getBlog(idToken: string, blogId: string): Promise<Blog> {
  console.log('Fetching blog with id: ', blogId)

  const response = await Axios.get(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Blog:', response.data)
  return response.data.item
}
export async function getMyBlog(
  idToken: string,
  blogId: string
): Promise<Blog> {
  console.log('Fetching my blog with id: ', blogId)

  const response = await Axios.get(`${apiEndpoint}/blogs/${blogId}?self=true`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Blog:', response.data)
  return response.data.item as Blog
}

export async function deleteMyBlog(
  idToken: string,
  blogId: string
): Promise<BlogListView> {
  console.log('Deleting a blog with id: ', blogId)

  const response = await Axios.delete(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Deleted Blog:', response.data)
  return response.data.item as BlogListView
}

export async function createBlog(
  idToken: string,
  blog: BlogRequest,
  image: File
): Promise<BlogListView> {
  console.log('Creating a new blog!', blog)

  const response = await Axios.post(`${apiEndpoint}/blogs`, blog, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Created Blog: ', response.data)

  const imageUploadUrl: string = response.data.item.blogImageUploadUrl
  await updateBlogImage(imageUploadUrl, image)

  return response.data.item as BlogListView
}
export async function updateBlog(
  idToken: string,
  blogId: string,
  blogRequest: BlogRequest
): Promise<BlogListView[]> {
  console.log('Updating a blog with id:', blogId)

  const response = await Axios.patch(
    `${apiEndpoint}/blogs/${blogId}`,
    blogRequest,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log('Updated Blog: ', response.data)

  return response.data.item
}

export async function getUpdateImageUrl(
  idToken: string,
  blogId: string
): Promise<string> {
  console.log('Getting update image url for blogId: ', blogId)

  const response = await Axios.get(
    `${apiEndpoint}/blogs/updateImageUrl/${blogId}`,
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${idToken}`
      }
    }
  )
  console.log('image url: ', response.data)

  return response.data.url as string
}

export async function updateBlogImage(imageUploadUrl: string, image: File) {
  await Axios.put(imageUploadUrl, image)
}
