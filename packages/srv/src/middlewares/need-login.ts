import type { Context, Next } from 'koa'
import { verifyToken } from '../common/utils'

export default async (ctx: Context, next: Next) => {
  const token = ctx.cookies.get('tinynote_token') || ''

  try {
    verifyToken(token)
  } catch {
    ctx.status = 401
    throw new Error('Need Login')
  }

  await next()
}
