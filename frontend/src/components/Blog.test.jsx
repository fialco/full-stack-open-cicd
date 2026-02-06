import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders only title and author', () => {
  const blog = {
    title: 'Testing blog rendering',
    author: 'Teppo Testeri',
    url: 'tepon-testit.com',
    likes: 12,
    user: { username: 'ttesti', name: 'Taneli Testi' }
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText('Testing blog rendering Teppo Testeri')
  expect(element).toBeDefined()

  const url = screen.queryByText('tepon-testit.com')
  expect(url).toBeNull()

  const likes = screen.queryByText('likes 12')
  expect(likes).toBeNull()

  const name = screen.queryByText('Taneli Testi')
  expect(name).toBeNull()
})

test('renders all info when view button pressed', async () => {
  const blog = {
    title: 'Testing blog rendering',
    author: 'Teppo Testeri',
    url: 'tepon-testit.com',
    likes: 12,
    user: { username: 'ttesti', name: 'Taneli Testi' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText('Testing blog rendering Teppo Testeri')
  screen.getByText('tepon-testit.com')
  screen.getByText('likes 12')
  screen.getByText('Taneli Testi')
})

test('pressing like button twice calls same function twice', async () => {
  const blog = {
    title: 'Testing blog rendering',
    author: 'Teppo Testeri',
    url: 'tepon-testit.com',
    likes: 12,
    user: { username: 'ttesti', name: 'Taneli Testi' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} updatedBlog={mockHandler} />)

  const user = userEvent.setup()
  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
  screen.getByText('likes 14')
})
