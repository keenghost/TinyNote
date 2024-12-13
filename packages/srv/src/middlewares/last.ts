import type { Context, Next } from 'koa'

export default async (ctx: Context, next: Next) => {
  try {
    ctx.status = 400

    await next()

    ctx.status = ctx.status === 400 ? 200 : ctx.status
  } catch (inError) {
    ctx.status = ctx.status || 400
    ctx.body = ctx.body || { errmsg: (inError as Error).message || 'Unknown Error Message' }
  }
}
