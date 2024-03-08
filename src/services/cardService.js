/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/cardModel'
import { columnModel } from '~/models/columnModel'

const createNew = async reqBody => {
  try {
    const newCard = {
      ...reqBody
    }

    const createdCard = await cardModel.createNew(newCard)

    // Get created card info
    const getCreatedCard = await cardModel.findOneById(createdCard.insertedId)

    if (getCreatedCard) {
      // Add new card to last of the array
      await columnModel.pushCardOrderIds(getCreatedCard)
    }

    // Other logics: send email, push notification, etc.

    // Always has to return
    return getCreatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew
}
