import express from 'express'
import path from 'path'

import { port } from '#root/config'
import { errorHandler } from '#root/middlewares'
import { mainRoutes } from '#root/routes'

const createApp = sessionStore => {
  const app = express()

  app.use(express.static('public'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(sessionStore)

  app.set('views', path.join(__dirname, 'views'))
  app.set('view engine', 'pug')

  app.use('/', mainRoutes)

  app.all('*', async (req, res, next) => {
    const error = `${req.path} page does not exists`

    res.status(404).render('error', { message: error })

    return next()
  })

  app.use(errorHandler)

  const server = app.listen(port, '0.0.0.0', () =>
    console.info(`Server is listening on http://localhost:${port}`)
  )

  return server
}

export default createApp
