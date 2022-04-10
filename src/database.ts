import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_TEST_DB,
  ENV,
} = process.env

// Documentation: https://node-postgres.com/api/pool
// Connecting to the database in case of Development
const poolDev = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
})

// Connecting to the database in case of test
const poolTest = new Pool({
  host: POSTGRES_HOST,
  database: POSTGRES_TEST_DB,
  user: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
})

const Client = ENV === 'test' ? poolTest : poolDev
console.log(`Connected to ${ENV} database`)
// Export the connection pool
export default Client
