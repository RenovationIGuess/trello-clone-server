import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators'

const createNew = async (req, res, next) => {
  const data = Joi.object({
    title: Joi.string().required().min(3).max(30).trim().strict().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must have at least {#limit} characters',
      'string.max': 'Title must have at most {#limit} characters',
      'string.trim': 'Title cannot have leading or trailing whitespace',
      'any.required': 'Title is required'
    }),
    description: Joi.string()
      .required()
      .min(3)
      .max(100)
      .trim()
      .strict()
      .messages({
        'string.base': 'Description must be a string',
        'string.empty': 'Description cannot be empty',
        'string.min': 'Description must have at least {#limit} characters',
        'string.max': 'Description must have at most {#limit} characters',
        'string.trim': 'Description cannot have leading or trailing whitespace',
        'any.required': 'Description is required'
      }),
    type: Joi.string()
      .valid(BOARD_TYPES.PRIVATE, BOARD_TYPES.PUBLIC)
      .required()
      .messages({
        'string.base': 'Type must be a string',
        'string.empty': 'Type cannot be empty',
        'any.only': 'Type must be either "private" or "public"',
        'any.required': 'Type is required'
      })
  })

  try {
    await data.validateAsync(req.body, {
      // Return full error message (if exists)
      abortEarly: false
    })

    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError)
  }
}

const update = async (req, res, next) => {
  const data = Joi.object({
    title: Joi.string().min(3).max(30).trim().strict().messages({
      'string.base': 'Title must be a string',
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must have at least {#limit} characters',
      'string.max': 'Title must have at most {#limit} characters',
      'string.trim': 'Title cannot have leading or trailing whitespace'
    }),
    description: Joi.string().min(3).max(100).trim().strict().messages({
      'string.base': 'Description must be a string',
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must have at least {#limit} characters',
      'string.max': 'Description must have at most {#limit} characters',
      'string.trim': 'Description cannot have leading or trailing whitespace'
    }),
    type: Joi.string().valid(BOARD_TYPES.PRIVATE, BOARD_TYPES.PUBLIC).messages({
      'string.base': 'Type must be a string',
      'string.empty': 'Type cannot be empty',
      'any.only': 'Type must be either "private" or "public"'
    }),
    columnOrderIds: Joi.array().items(
      Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    )
  })

  try {
    await data.validateAsync(req.body, {
      // Return full error message (if exists)
      abortEarly: false,
      allowUnknown: true
    })

    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError)
  }
}

const moveCardToDifferentColumn = async (req, res, next) => {
  const data = Joi.object({
    currentCardId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),

    prevColumnId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),

    prevCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      ),

    nextColumnId: Joi.string()
      .pattern(OBJECT_ID_RULE)
      .message(OBJECT_ID_RULE_MESSAGE)
      .required(),

    nextCardOrderIds: Joi.array()
      .required()
      .items(
        Joi.string().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
      )
  })

  try {
    await data.validateAsync(req.body, {
      abortEarly: false
    })

    next()
  } catch (error) {
    const errorMessage = new Error(error).message
    const customError = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorMessage
    )
    next(customError)
  }
}

export const boardValidation = {
  createNew,
  update,
  moveCardToDifferentColumn
}
