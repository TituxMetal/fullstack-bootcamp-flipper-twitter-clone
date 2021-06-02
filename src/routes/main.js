import { Router } from 'express'

import { loginOrSignup } from '#root/utils'

const router = new Router()

router.get('/', (req, res) => {
  if (!req.session.userid) {
    return res.render('login')
  }
  console.log(req.session)

  return res.render('dashboard')
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
