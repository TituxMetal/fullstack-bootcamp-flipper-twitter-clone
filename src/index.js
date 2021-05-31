import { shutdownServer } from '#root/helpers'

import createApp from './app'

const server = createApp()

// @TODO connection to redis

shutdownServer(server)
