const lodash = require('lodash')
const blog = require('../models/blog')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const reducer = (max, item) => {
    return max.likes > item.likes 
      ? max 
      : item
  }

  const {title, author, likes} = blogs.reduce(reducer, 0)
  return {title, author, likes}
}

const mostBlogs = (blogs) => {
  const counts = lodash.countBy(blogs, 'author')
  const maxBlogger = lodash.maxBy(Object.entries(counts), ([author, blogs]) => blogs)

  if (!maxBlogger) {
    return {
      author: undefined,
      blogs: undefined
    }
  }
  
  return {
    author: maxBlogger[0],
    blogs: maxBlogger[1]
  }
}

const mostLikes = (blogs) => {
  const blogsByAuthor = lodash.groupBy(blogs, 'author')

  const likesByAuthor = lodash.mapValues(blogsByAuthor, (authorBlogs) => {
    return lodash.sumBy(authorBlogs, 'likes')
  })

  const maxLikes = lodash.maxBy(Object.entries(likesByAuthor), ([author, likes]) => likes)

  if (!maxLikes) {
    return {
      author: undefined,
      likes: undefined
    }
  }
  
  return {
    author: maxLikes[0],
    likes: maxLikes[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}