/* eslint-disable no-unused-vars */
import { StatusCodes } from 'http-status-codes'
import { boardService } from '~/services/boardService'

const createNew = () => {
  return async (req, res, next) => {
    try {
      // Redirect to service
      const createdBoard = await boardService.createNew(req.body)

      res.status(StatusCodes.CREATED).json(createdBoard)
    } catch (error) {
      next(error)
    }
  }
}

export const boardController = {
  createNew
}
