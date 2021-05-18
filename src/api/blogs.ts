import Axios from 'axios'
import { apiEndpoint } from '../config'
import { BlogListView } from './../types/Blog'

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

export async function deleteMyBlog(
  idToken: string,
  blogId: string
): Promise<BlogListView[]> {
  console.log('Deleting a blog with id: ', blogId)

  const response = await Axios.delete(`${apiEndpoint}/blogs/${blogId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${idToken}`
    }
  })
  console.log('Deleted Blog:', response.data)
  return response.data.items
}
