/* eslint-disable no-useless-catch */
import { boardModel } from '~/models/boardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async reqBody => {
  try {
    const newColumn = {
      ...reqBody
    }

    const createdColumn = await columnModel.createNew(newColumn)

    // Get created column info
    const getCreatedColumn = await columnModel.findOneById(
      createdColumn.insertedId
    )

    if (getCreatedColumn) {
      getCreatedColumn.cards = []

      // Update columnOrderIds in boards collection
      await boardModel.pushColumnOrderIds(getCreatedColumn)
    }

    // Other logics: send email, push notification, etc.

    // Always has to return
    return getCreatedColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updateData)

    return updatedColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update
}
