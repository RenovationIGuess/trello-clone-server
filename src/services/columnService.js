/* eslint-disable no-useless-catch */
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

    // Other logics: send email, push notification, etc.

    // Always has to return
    return getCreatedColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew
}
