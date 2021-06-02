import Redis from 'ioredis'

import { databaseUri } from '#root/config'

export const redisClient = new Redis(databaseUri)

redisClient.on('error', error =>
  console.error('REDIS CONNECTION ERROR: ', error)
)
