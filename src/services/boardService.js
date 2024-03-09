/* eslint-disable no-useless-catch */
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { boardModel } from '~/models/boardModel'
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'
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
        card => card.columnId.toString() === column._id.toString()
      )
    })

    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updateData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const moveCardToDifferentColumn = async reqBody => {
  try {
    // 1. Update cardOrderIds of the old column - aka delete the card from the old column
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    // 2. Update cardOrderIds of the new column - aka add the card to the new column
    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    // 3. Update the card's columnId
    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return {
      updatedCard: 'Successfully!'
    }
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew,
  getDetails,
  update,
  moveCardToDifferentColumn
}
