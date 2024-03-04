/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'

const createNew = () => {
  return async (req, res, next) => {
    try {
      // Redirect to service

      res.status(StatusCodes.CREATED).json({ message: 'Create new board' })
    } catch (error) {
      next(error)
    }
  }
}

export const boardController = {
  createNew
}
