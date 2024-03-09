import Joi from 'joi'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

// Define Collection (name & schema)
const COLUMN_COLLECTION_NAME = 'columns'
const COLUMN_COLLECTION_SCHEMA = Joi.object({
  boardId: Joi.string()
    .required()
    .pattern(OBJECT_ID_RULE)
    .message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),

  // Lưu ý các item trong mảng cardOrderIds là ObjectId nên cần thêm pattern cho chuẩn nhé, (lúc quay video số 57 mình quên nhưng sang đầu video số 58 sẽ có nhắc lại về cái này.)
  cardOrderIds: Joi.array()
    .items(Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE))
    .default([]),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'boardId', 'createdAt']

const validateBeforeCreate = async data => {
  try {
    const value = await COLUMN_COLLECTION_SCHEMA.validateAsync(data, {
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
    const newData = {
      ...validData,
      boardId: new ObjectId(validData.boardId)
    }
    const createdColumn = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .insertOne(newData)

    return createdColumn
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async id => {
  try {
    const column = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOne({ _id: new ObjectId(id) })

    return column
  } catch (error) {
    throw new Error(error)
  }
}

// Add new card to last of the array
const pushCardOrderIds = async card => {
  try {
    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(card.columnId)
          // _destroy: false
        },
        {
          $push: {
            cardOrderIds: new ObjectId(card._id)
          }
        },
        {
          // Return the updated document
          returnDocument: 'after'
        }
      )

    // findOneAndUpdate return the value
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (columnId, updateData) => {
  try {
    Object.keys(updateData).forEach(key => {
      if (INVALID_UPDATE_FIELDS.includes(key)) {
        delete updateData[key]
      }
    })

    // For data that related to type objectId, handle here
    if (updateData.cardOrderIds) {
      updateData.cardOrderIds = updateData.cardOrderIds.map(
        id => new ObjectId(id)
      )
    }

    const result = await GET_DB()
      .collection(COLUMN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: new ObjectId(columnId)
          // _destroy: false
        },
        {
          $set: updateData
        },
        {
          // Return the updated document
          returnDocument: 'after'
        }
      )

    // findOneAndUpdate return the value
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const columnModel = {
  COLUMN_COLLECTION_NAME,
  COLUMN_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  pushCardOrderIds,
  update
}
