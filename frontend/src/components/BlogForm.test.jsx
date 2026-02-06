import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('Creating blog is called with correct values', async () => {
  const user = userEvent.setup()
  const createBlog = vi.fn()

  const { container } = render(<BlogForm createBlog={createBlog} />)

  const titleInput = container.querySelector('#title-input')
  const authorInput = container.querySelector('#author-input')
  const urlInput = container.querySelector('#url-input')
  const createButton = screen.getByText('create')

  await user.type(titleInput, 'testing title form...')
  await user.type(authorInput, 'Teppo Testi')
  await user.type(urlInput, 'tepon-testit.com')
  await user.click(createButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing title form...')
  expect(createBlog.mock.calls[0][0].author).toBe('Teppo Testi')
  expect(createBlog.mock.calls[0][0].url).toBe('tepon-testit.com')
})