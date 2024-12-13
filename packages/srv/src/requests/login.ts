import { newToken } from '../common/utils'
import type { IContext, IEmptyRes, ILoginReq } from '../types/http'

const USERNAME = process.env['WEB_USER'] || 'admin'
const PASSWORD = process.env['WEB_PASS'] || 'admin'

export default async (ctx: IContext<IEmptyRes>) => {
  const { username, password } = ctx.request.body as ILoginReq

  if (username !== USERNAME || password !== PASSWORD) {
    throw new Error('username or password wrong')
  }

  const token = newToken()

  ctx.cookies.set('tinynote_token', token, {
    httpOnly: true,
    overwrite: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })

  ctx.body = 'OK'
}
