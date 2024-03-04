/* eslint-disable no-console */
import express from 'express'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB } from './config/mongodb'
import { env } from './config/environment'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware'

const START_SERVER = () => {
  const app = express()

  // Enable req.body json data
  app.use(express.json())

  app.use('/v1', APIs_V1)

  // Middleware to handle error
  app.use(errorHandlingMiddleware)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server is listening on http://${env.APP_HOST}:${env.APP_PORT}`)
  })

  exitHook(signal => {
    console.log(`Server is shutting down because of ${signal}`)
    CLOSE_DB()
    process.exit(0)
  })
}

// IIFE
;(async () => {
  try {
    console.log('Starting server...')
    await CONNECT_DB()
    console.log('Connected to MongoDB Cloud Atlas')
    START_SERVER()
  } catch (error) {
    console.error(error)
    process.exit(0)
  }
})()

// console.log('Starting server...')
// CONNECT_DB()
//   .then(() => {
//     console.log('Connected to MongoDB Cloud Atlas')
//   })
//   .then(() => {
//     START_SERVER()
//   })
//   .catch(error => {
//     console.error(error)
//     process.exit(0)
//   })
