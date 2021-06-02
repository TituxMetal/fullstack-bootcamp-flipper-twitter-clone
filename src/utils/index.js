import { hash, compare, genSalt } from 'bcryptjs'

import { redisClient } from '#root/database'

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
