import { Router } from 'express'

import { redisClient } from '#root/database'
import {
  getAllPosts,
  handleAddPost,
  handleFollowUser,
  getFollowingUsers,
  loginOrSignup
} from '#root/utils'

const router = new Router()

router.get('/', async (req, res) => {
  if (!req.session.userid) {
    return res.render('login')
  }

  const currentUser = await redisClient.hget(
    `user:${req.session.userid}`,
    'email'
  )
  console.log('currentUser', currentUser)

  const users = await getFollowingUsers(currentUser)
  console.log('users', users)

  const timeline = await getAllPosts(currentUser)
  console.log('timeline', timeline)

  return res.render('dashboard', { currentUser, timeline, users })
})

router.get('/post', (req, res) => {
  if (!req.session.userid) {
    return res.render('login')
  }

  return res.render('post')
})

router.post('/post', async (req, res) => {
  if (!req.session.userid) {
    return res.render('login')
  }

  const { message } = req.body

  const userId = req.session.userid

  const currentUser = await redisClient.hget(`user:${userId}`, 'email')

  const postId = await handleAddPost(userId, currentUser, message)

  const followers = await redisClient.smembers(`followers:${currentUser}`)
  console.log('message', message)
  console.log('userId', userId)
  console.log('currentUserEmail', currentUser)
  console.log('postId returned by handleAddPost', postId)
  console.log('followers', followers)

  for (const follower of followers) {
    redisClient.lpush(`timeline:${follower}`, postId)
  }

  return res.redirect('/')
})

router.post('/follow', async (req, res) => {
  const userId = req.session.userid
  const userToFollow = req.body.username

  await handleFollowUser(userId, userToFollow)

  return res.redirect('/')
})

router.post('/', async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(422)
      .render('error', { message: 'Please set both email and password' })
  }

  const user = await loginOrSignup(email, password)

  console.log('result returning by loginOrSignup', user)

  if (!user) {
    return res
      .status(401)
      .render('error', { message: 'Invalid email or password' })
  }

  req.session.userid = user
  req.session.save()

  return res.redirect('/')
})

export default router
