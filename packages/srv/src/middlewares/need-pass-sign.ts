import { type Context, type Next } from 'koa'
import crypto from 'node:crypto'
import { config } from '../common/config'

const WEB_DB_PASS_SIGN = crypto
  .createHash('md5')
  .update(config.get('web_db_pass'))
  .digest('hex')

export default async (ctx: Context, next: Next) => {
  const sign = ctx.headers['x-pass-sign']

  if (sign !== WEB_DB_PASS_SIGN) {
    ctx.status = 489
    throw new Error('Password Sign not match')
  }

  await next()
}
