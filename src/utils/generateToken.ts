import jwt from 'jsonwebtoken'
import { User } from '../models/user'

export async function generateToken(user: User): Promise<string> {
  return jwt.sign({ user: user }, process.env.TOKEN_SECRET || '', {
    expiresIn: '365d',
  })
}
