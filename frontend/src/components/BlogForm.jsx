import { useState } from 'react'
import PropTypes from 'prop-types'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: title,
      author: author,
      url: url
    })

    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <div>
      <h2>create new</h2>

      <form onSubmit={addBlog}>
        <div>
          title:
          <input
            data-testid='title'
            type='text'
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            id='title-input'
          />
        </div>
        <div>
          author:
          <input
            data-testid='author'
            type='text'
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            id='author-input'
          />
        </div>
        <div>
          url:
          <input
            data-testid='url'
            type='text'
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            id='url-input'
          />
        </div>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}

BlogForm.propTypes = {
  createBlog: PropTypes.func.isRequired
}

export default BlogForm
