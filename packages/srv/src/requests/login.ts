import { config } from '../common/config'
import { newToken } from '../common/token'
import { type IContext, type ILoginReq } from '../types/http'

export default async (ctx: IContext) => {
  const { username, password } = ctx.request.body as ILoginReq

  if (username !== config.get('username') || password !== config.get('password')) {
    throw new Error('username or password wrong')
  }

  const token = newToken()

  ctx.cookies.set('tinynote_token', token, {
    httpOnly: true,
    overwrite: true,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  })
}
