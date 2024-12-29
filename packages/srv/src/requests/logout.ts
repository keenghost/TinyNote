import { type IContext } from '../types/http'

export default async (ctx: IContext) => {
  ctx.cookies.set('tinynote_token', null, {
    maxAge: 0,
  })
}
