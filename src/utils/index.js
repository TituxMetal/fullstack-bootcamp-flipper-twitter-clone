import { hash, compare, genSalt } from 'bcryptjs'
import { formatDistance } from 'date-fns'

import { redisClient } from '#root/database'

export const getPostByKey = async (postId, key) =>
  redisClient.hget(`post:${postId}`, key)

export const getUserByEmail = async userId =>
  redisClient.hget(`user:${userId}`, 'email')

export const getFollowingUsers = async currentUser => {
  console.log(currentUser)
  const following = await redisClient.smembers(`following:${currentUser}`)
  console.log('following', following)

  const allUsers = await redisClient.hkeys('users')
  // const promises = allUsers.map(async user => user)
  // const results = await Promise.all(promises)
  console.log('allUsers', allUsers)

  const users = allUsers.filter(
    user => user !== currentUser && following.indexOf(user) === -1
  )

  return users
}

export const handleFollowUser = async (userId, userToFollow) => {
  const currentUser = await getUserByEmail(userId, 'email')

  await redisClient.sadd(`following:${currentUser}`, userToFollow)
  await redisClient.sadd(`followers:${userToFollow}`, currentUser)
}

export const getAllPosts = async currentUser => {
  const allPosts = await redisClient.lrange(`timeline:${currentUser}`, 0, 100)

  // https://zellwk.com/blog/async-await-in-loops/

  const promises = allPosts.map(async post => {
    const username = await getPostByKey(post, 'username')
    const author = username.split('@')[0]
    const message = await getPostByKey(post, 'message')
    const timestamp = await getPostByKey(post, 'timestamp')
    const timeString = formatDistance(
      new Date(),
      new Date(parseInt(timestamp, 10))
    )

    return { author, message, timeString }
  })

  const results = await Promise.all(promises)

  return results
}

export const handleAddPost = async (userId, currentUserName, message) => {
  const postId = await redisClient.incr('postid')
  console.log('postId', postId)

  await redisClient.hset(
    `post:${postId}`,
    'userid',
    userId,
    'username',
    currentUserName,
    'message',
    message,
    'timestamp',
    Date.now()
  )
  await redisClient.lpush(`timeline:${currentUserName}`, postId)

  return postId
}

export const handleSignup = async (email, password) => {
  const userid = await redisClient.incr('userid')
  console.log('getting a new userid by incrementing', userid)

  await redisClient.hset('users', email, userid)
  console.log('saving the email and userid in users')

  const hashedPassword = await hash(password, await genSalt(10))
  console.log('creating a hash with the given password', hashedPassword)

  await redisClient.hset(
    `user:${userid}`,
    'hash',
    hashedPassword,
    'email',
    email
  )
  console.log('adds the user infos in redis and shows the results', userid)

  return userid
}

export const handleLogin = async (userid, password) => {
  const passwordHash = await redisClient.hget(`user:${userid}`, 'hash')
  console.log('passwordHash variable in handleLogin(): ', passwordHash)

  const result = await compare(password, passwordHash)
  console.log(
    'result of comparing the password with the hashed password',
    result
  )

  return !!result
}

export const loginOrSignup = async (email, password) => {
  const userid = await redisClient.hget('users', email)
  console.log('userid', userid)

  if (!userid) {
    console.log('No userid, handleSignup')
    const user = handleSignup(email, password)
    return user
  }

  console.log('there is a userid, handleLogin', userid)

  const result = await handleLogin(userid, password)

  console.log('result from handleLogin', result)

  return result ? userid : null
}
