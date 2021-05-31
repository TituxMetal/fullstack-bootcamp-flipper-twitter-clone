const {
  DATABASE_URI = 'redis://username:password@localhost:port',
  NODE_ENV = 'development',
  PORT = 3000
} = process.env

export const databaseUri = DATABASE_URI

export const inProd = NODE_ENV === 'production'

export const port = PORT
