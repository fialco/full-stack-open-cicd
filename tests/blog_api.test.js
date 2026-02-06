const { test, after, before, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)

const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there are some blogs saved initially', () => {
  before(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'testUser', passwordHash })

    await user.save()

    const userForToken = {
      username: user.username,
      id: user._id
    }

    token = jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
  })

  beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
      .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('corrent amount of blogs are returned in json format', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
  })

  test('blog identifiers are named id and instead of _id', async () => {
    const blogsInDb = await helper.blogsInDb()

    assert(blogsInDb.every((blog) => blog.hasOwnProperty('id')))
    assert.strictEqual(blogsInDb.every((blog) => blog.hasOwnProperty('_id')), false)
  })

  describe('addition of a new blog', () => {

    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Testing blog v.1.0',
        author: 'Teppo Testeri',
        url: 'testaajat.com',
        likes: 13
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      const title = response.body.map(r => r.title)
      const author = response.body.map(r => r.author)

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      assert(title.includes('Testing blog v.1.0'))
      assert(author.includes('Teppo Testeri'))
    })

    test('without likes defaults to zero likes', async () => {
      const newBlog = {
        title: 'Testing non-likes v.1.2',
        author: 'Taneli Tykkääjä',
        url: 'testaajat.com',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      const addedBlog = response.body.filter(blog => blog.title === 'Testing non-likes v.1.2')

      assert.strictEqual(addedBlog[0].likes, 0)
    })

    test('without title not added', async () => {
      const newBlog = {
        author: 'Taneli Tykkääjä',
        url: 'testaajat.com',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('without url not added', async () => {
      const newBlog = {
        title: 'Testing non-likes v.1.2',
        author: 'Taneli Tykkääjä',
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('without a token not added', async () => {
      const newBlog = {
        title: 'Testing non-tokens v.1.5',
        author: 'Taneli Tykkääjä',
      }

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(401)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {

    test('succeeds with status code 204 if id is valid', async () => {
      const newBlog = {
        title: 'Testing blog v.1.0',
        author: 'Teppo Testeri',
        url: 'testaajat.com',
        likes: 13
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      const blogToDelete = response.body[response.body.length - 1]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)

      const titles = blogsAtEnd.map(r => r.title)
      assert(!titles.includes(blogToDelete.title))
    })

    test('fail with status code 400 if id is invalid', async () => {
      await api
        .delete(`/api/blogs/asdf456`)
        .set('Authorization', `Bearer ${token}`)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fail with status code 401 if token not given', async () => {
      const newBlog = {
        title: 'Testing blog v.1.0',
        author: 'Teppo Testeri',
        url: 'testaajat.com',
        likes: 13
      }

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const response = await api.get('/api/blogs')

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1)

      const blogToDelete = response.body[response.body.length - 1]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(401)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length +1)
    })
  })

  describe('updating a blog', () => {

    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToUpdate = blogsAtStart.filter(blog => blog.title === 'TDD harms architecture')[0]

      const blogUpdate = {...blogToUpdate, likes: 15}

      await api
        .put(`/api/blogs/${blogUpdate.id}`)
        .send(blogUpdate)
        .expect(200)

      const blogsAtEnd = await helper.blogsInDb()
      const updatedBlog = blogsAtEnd.filter(blog => blog.title === 'TDD harms architecture')[0]

      assert.strictEqual(updatedBlog.likes, 15)
    })

    test('fail with status code 400 if id is invalid', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToUpdate = blogsAtStart.filter(blog => blog.title === 'TDD harms architecture')[0]

      const blogUpdate = {...blogToUpdate, likes: 15}

      await api
        .put(`/api/blogs/asdf456`)
        .send(blogUpdate)
        .expect(400)

      const blogsAtEnd = await helper.blogsInDb()

      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})