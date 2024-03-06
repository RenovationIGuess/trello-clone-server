/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import ApiError from '~/utils/ApiError'
import { slugify } from '~/utils/formatters'

const createNew = async reqBody => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call to model to handle save new board to db
    /**
     * {
     *   insertedId: ...
     *   acknowledged: ...
     * }
     */
    const createdBoard = await boardModel.createNew(newBoard)

    // Get created board info
    const getCreatedBoard = await boardModel.findOneById(
      createdBoard.insertedId
    )

    // Other logics: send email, push notification, etc.

    // Always has to return
    return getCreatedBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async boardId => {
  try {
    const board = await boardModel.getDetails(boardId)

    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found')
    }

    // Board from response
    const resBoard = cloneDeep(board)

    // Adjust the cards attr
    resBoard.columns.forEach(column => {
      column.cards = resBoard.cards.filter(
        // Alternative: use equal to check id
        card => card.columnId.toString() === column.columnId.toString()
      )
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails
}
