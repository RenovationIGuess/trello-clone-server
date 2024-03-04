/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'

const createNew = async reqBody => {
  try {
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Call to model to handle save new board to db

    // Other logics: send email, push notification, etc.

    // Always has to return
    return newBoard
  } catch (error) {
    throw error
  }
}

export const boardService = {
  createNew: createNew
}
