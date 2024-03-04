// Username: ramu
// Password: 0HVlhIqBetrPsdF3
import { MongoClient, ServerApiVersion } from 'mongodb'
import { env } from './environment'

let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

// Connect to database
export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

// Only call this function after connected to database
export const GET_DB = () => {
  if (!trelloDatabaseInstance) {
    throw new Error('Database is not connected')
  }
  return trelloDatabaseInstance
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}
