import { Router } from 'express'

const router = new Router()

router.get('/', (_req, res) => res.render('login'))

router.post('/', (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res
      .status(422)
      .render('error', { message: 'Please set both email and password' })
  }

  console.log(req.body, email, password)

  return res.end()
})

export default router
