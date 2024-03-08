import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'
import { columnModel } from './columnModel'
import { cardModel } from './cardModel'

const BOARD_COLLECTION_NAME = 'boards'

const BOARD_COLLECTION_SCHEMA = Joi.object({
  title: Joi.string().required().min(3).max(30).trim().strict(),
  slug: Joi.string().required().min(5).max(60).trim().strict(),
  description: Joi.string().required().min(3).max(100).trim().strict(),
  type: Joi.string()
    .valid(BOARD_TYPES.PRIVATE, BOARD_TYPES.PUBLIC)
    .default('private'),
  columnOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const validateBeforeCreate = async data => {
  try {
    const value = await BOARD_COLLECTION_SCHEMA.validateAsync(data, {
      abortEarly: false
    })
    return value
  } catch (error) {
    throw new Error(error)
  }
}

const createNew = async data => {
  try {
    const validData = await validateBeforeCreate(data)
    const createdBoard = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .insertOne(validData)

    return createdBoard
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async id => {
  try {
    const board = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return board
  } catch (error) {
    throw new Error(error)
  }
}

const getDetails = async id => {
  try {
    // FIXME: Add aggregate to get board details with columns and cards
    const board = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .aggregate([
        {
          $match: {
            _id: new ObjectId(id),
            _destroy: false
          }
        },
        {
          $lookup: {
            from: columnModel.COLUMN_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'columns'
          }
        },
        {
          $lookup: {
            from: cardModel.CARD_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'boardId',
            as: 'cards'
          }
        }
      ])
      .toArray()

    return board[0] || null
  } catch (error) {
    throw new Error(error)
  }
}

// Add new column to last of the array
const pushColumnOrderIds = async column => {
  try {
    const result = await GET_DB()
      .collection(BOARD_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(column.boardId)
          // _destroy: false
        },
        {
          $push: {
            columnOrderIds: new ObjectId(column._id)
          }
        },
        {
          // Return the updated document
          returnDocument: 'after'
        }
      )

    // findOneAndUpdate return the value
    return result.value
  } catch (error) {
    throw new Error(error)
  }
}

export const boardModel = {
  BOARD_COLLECTION_NAME,
  BOARD_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getDetails,
  pushColumnOrderIds
}
