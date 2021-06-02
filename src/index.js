import connectRedis from 'connect-redis'
import session from 'express-session'

import { sessionOptions } from '#root/config'
import { redisClient } from '#root/database'
import { shutdownServer } from '#root/helpers'

import createApp from './app'

const RedisStore = connectRedis(session)
const store = new RedisStore({ client: redisClient })
const sessionStore = session({
  ...sessionOptions,
  store
})
const server = createApp(sessionStore)

shutdownServer(server)
