import { useState } from 'react'

const Blog = ({ blog, updatedBlog, user, deleteBlog }) => {
  const [expanded, setExpanded] = useState(false)
  const [likes, setLikes] = useState(blog.likes)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const likeBlog = (event) => {
    const updatedLikes = likes + 1
    setLikes(updatedLikes)
    updatedBlog(blog.id, {
      user: blog.user.id,
      likes: updatedLikes,
      title: blog.title,
      author: blog.author,
      url: blog.url
    })
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      deleteBlog(blog.id)
    }
  }

  const showDeleteButton =
    blog.user && user && blog.user.username === user.username

  if (expanded) {
    return (
      <div className='blog' style={blogStyle}>
        <div>
          {blog.title} {blog.author}{' '}
          <button onClick={() => setExpanded(false)}>hide</button>
        </div>
        <div>{blog.url}</div>
        <div>
          likes {likes} <button onClick={() => likeBlog()}>like</button>
        </div>
        <div>{blog.user.name}</div>
        {showDeleteButton && (
          <div>
            <button
              onClick={() => handleDelete()}
              style={{ backgroundColor: 'cornflowerblue', color: 'black' }}
            >
              remove
            </button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className='blog' style={blogStyle}>
      <div>
        {blog.title} {blog.author}{' '}
        <button onClick={() => setExpanded(true)}>view</button>
      </div>
    </div>
  )
}

export default Blog
