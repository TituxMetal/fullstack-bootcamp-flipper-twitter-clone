const {
  DATABASE_URI = 'redis://username:password@localhost:port',
  NODE_ENV = 'development',
  PORT = 3000,
  SESSION_IDLE_TIMEOUT = 360000,
  SESSION_NAME = 'sid',
  SESSION_SECRET = 'please keep this secret'
} = process.env

export const databaseUri = DATABASE_URI

export const inProd = NODE_ENV === 'production'

export const port = +PORT

export const sessionOptions = {
  cookie: {
    maxAge: +SESSION_IDLE_TIMEOUT,
    sameSite: true,
    secure: inProd
  },
  name: SESSION_NAME,
  resave: true,
  saveUninitialized: true,
  secret: SESSION_SECRET
}
