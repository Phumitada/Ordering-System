import jwt, { SignOptions } from 'jsonwebtoken'

const ACCESS_SECRET = process.env.ACCESS_TOKEN_SECRET!
const REFRESH_SECRET = process.env.REFRESH_TOKEN_SECRET!

export interface TokenPayload {
  userId: string
  email: string
  role: string
}

export const generateAccessToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: '15m' }
  return jwt.sign(payload, ACCESS_SECRET, options)
}

export const generateRefreshToken = (payload: TokenPayload): string => {
  const options: SignOptions = { expiresIn: '7d' }
  return jwt.sign(payload, REFRESH_SECRET, options)
}

export const verifyAccessToken = (token: string): TokenPayload => {
  return jwt.verify(token, ACCESS_SECRET) as TokenPayload
}

export const verifyRefreshToken = (token: string): TokenPayload => {
  return jwt.verify(token, REFRESH_SECRET) as TokenPayload
}
