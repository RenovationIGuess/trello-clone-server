import express from 'express'
import StatusCodes from 'http-status-codes'
import { boardRoute } from './boardRoute'

const Router = express.Router()

Router.get('/', async (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'Welcome to Trello API' })
})

/**
 * Boards related routes
 */
Router.use('/boards', boardRoute)

export const APIs_V1 = Router
