import { type Context, type Next } from 'koa'
import { db } from '../common/db.js'

export default async (ctx: Context, next: Next) => {
  const newestV = parseInt((ctx.headers['x-newest-v'] as string) || '0', 10)
  const v = db.getV()

  if (newestV !== v) {
    ctx.status = 488
    throw new Error('v is not newest')
  }

  await next()
}
